CREATE TYPE szerepkor       AS ENUM ('DISZPECSER', 'SZERELO');
CREATE TYPE esemeny_tipus   AS ENUM ('TERVEZETT_KARBANTARTAS', 'HIBABEJELENTES');
CREATE TYPE esemeny_statusz AS ENUM ('TERVEZETT', 'KIOSZTOTT', 'FOLYAMATBAN', 'KESZ', 'LEZART', 'TOROLT');
CREATE TYPE prioritas       AS ENUM ('ALACSONY', 'NORMAL', 'MAGAS', 'SURGOS');
CREATE TYPE foto_tipus      AS ENUM ('HIBA', 'ELVEGZETT_MUNKA');
CREATE TYPE azonositas_mod  AS ENUM ('QR', 'KEZI');


CREATE OR REPLACE FUNCTION set_modositva()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modositva = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TABLE ugyfel (
    id                  BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nev                 VARCHAR(255) NOT NULL,
    adoszam             VARCHAR(20),
    kapcsolattarto_nev  VARCHAR(255),
    email               VARCHAR(255),
    telefon             VARCHAR(50),
    aktiv               BOOLEAN      NOT NULL DEFAULT TRUE,
    letrehozva          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    modositva           TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_ugyfel_nev       ON ugyfel (nev);
CREATE INDEX idx_ugyfel_modositva ON ugyfel (modositva);

CREATE TRIGGER trg_ugyfel_modositva BEFORE UPDATE ON ugyfel
    FOR EACH ROW EXECUTE FUNCTION set_modositva();


CREATE TABLE telephely (
    id            BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ugyfel_id     BIGINT       NOT NULL REFERENCES ugyfel (id),
    nev           VARCHAR(255) NOT NULL,
    cim           VARCHAR(255),
    varos         VARCHAR(100),
    iranyitoszam  VARCHAR(10),
    megjegyzes    TEXT,
    aktiv         BOOLEAN      NOT NULL DEFAULT TRUE,
    letrehozva    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    modositva     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_telephely_ugyfel    ON telephely (ugyfel_id);
CREATE INDEX idx_telephely_modositva ON telephely (modositva);

CREATE TRIGGER trg_telephely_modositva BEFORE UPDATE ON telephely
    FOR EACH ROW EXECUTE FUNCTION set_modositva();


CREATE TABLE geptipus (
    id                           BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    gyarto                       VARCHAR(150) NOT NULL,
    tipusnev                     VARCHAR(150) NOT NULL,
    leiras                       TEXT,
    karbantartas_ciklus_nap      INT,
    karbantartas_ciklus_uzemora  INT,
    aktiv                        BOOLEAN      NOT NULL DEFAULT TRUE,
    letrehozva                   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    modositva                    TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT uk_geptipus_gyarto_tipus UNIQUE (gyarto, tipusnev),
    CONSTRAINT ck_geptipus_ciklus_pozitiv CHECK (
        (karbantartas_ciklus_nap     IS NULL OR karbantartas_ciklus_nap     > 0) AND
        (karbantartas_ciklus_uzemora IS NULL OR karbantartas_ciklus_uzemora > 0)
    )
);

CREATE INDEX idx_geptipus_modositva ON geptipus (modositva);

CREATE TRIGGER trg_geptipus_modositva BEFORE UPDATE ON geptipus
    FOR EACH ROW EXECUTE FUNCTION set_modositva();


CREATE TABLE gep (
    id                           BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid                         UUID         NOT NULL UNIQUE,
    geptipus_id                  BIGINT       NOT NULL REFERENCES geptipus (id),
    telephely_id                 BIGINT       NOT NULL REFERENCES telephely (id),
    sorozatszam                  VARCHAR(100) NOT NULL UNIQUE,
    megnevezes                   VARCHAR(255),
    telepites_datuma             DATE,
    uzemora                      INT,
    utolso_karbantartas_datum    DATE,
    utolso_karbantartas_uzemora  INT,
    aktiv                        BOOLEAN      NOT NULL DEFAULT TRUE,
    letrehozva                   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    modositva                    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    verzio                       INT          NOT NULL DEFAULT 1
);

CREATE INDEX idx_gep_telephely ON gep (telephely_id);
CREATE INDEX idx_gep_geptipus  ON gep (geptipus_id);
CREATE INDEX idx_gep_modositva ON gep (modositva);

CREATE TRIGGER trg_gep_modositva BEFORE UPDATE ON gep
    FOR EACH ROW EXECUTE FUNCTION set_modositva();



CREATE TABLE felhasznalo (
    id           BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email        VARCHAR(255) NOT NULL UNIQUE,
    jelszo_hash  VARCHAR(100) NOT NULL,
    nev          VARCHAR(255) NOT NULL,
    szerepkor    szerepkor    NOT NULL,
    telefon      VARCHAR(50),
    aktiv        BOOLEAN      NOT NULL DEFAULT TRUE,
    letrehozva   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    modositva    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_felhasznalo_modositva BEFORE UPDATE ON felhasznalo
    FOR EACH ROW EXECUTE FUNCTION set_modositva();



CREATE TABLE refresh_token (
    id              BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    felhasznalo_id  BIGINT      NOT NULL REFERENCES felhasznalo (id),
    token_hash      CHAR(64)    NOT NULL UNIQUE,
    lejar           TIMESTAMPTZ NOT NULL,
    visszavonva     TIMESTAMPTZ,
    letrehozva      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_refresh_token_felhasznalo ON refresh_token (felhasznalo_id);



CREATE TABLE szervizesemeny (
    id                       BIGINT          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid                     UUID            NOT NULL UNIQUE,
    gep_id                   BIGINT          NOT NULL REFERENCES gep (id),
    hozzarendelt_szerelo_id  BIGINT          REFERENCES felhasznalo (id),
    letrehozta_id            BIGINT          REFERENCES felhasznalo (id),
    tipus                    esemeny_tipus   NOT NULL,
    statusz                  esemeny_statusz NOT NULL DEFAULT 'TERVEZETT',
    prioritas                prioritas       NOT NULL DEFAULT 'NORMAL',
    bejelentett_hiba         TEXT,
    tervezett_datum          DATE,
    tervezett_idopont        TIME,
    letrehozva               TIMESTAMPTZ     NOT NULL DEFAULT now(),
    modositva                TIMESTAMPTZ     NOT NULL DEFAULT now(),
    verzio                   INT             NOT NULL DEFAULT 1
);

CREATE INDEX idx_szervizesemeny_gep           ON szervizesemeny (gep_id);
CREATE INDEX idx_szervizesemeny_szerelo_datum ON szervizesemeny (hozzarendelt_szerelo_id, tervezett_datum);
CREATE INDEX idx_szervizesemeny_statusz       ON szervizesemeny (statusz);
CREATE INDEX idx_szervizesemeny_modositva     ON szervizesemeny (modositva);

CREATE TRIGGER trg_szervizesemeny_modositva BEFORE UPDATE ON szervizesemeny
    FOR EACH ROW EXECUTE FUNCTION set_modositva();


CREATE TABLE szervizesemeny_statusz_naplo (
    id                 BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    szervizesemeny_id  BIGINT       NOT NULL REFERENCES szervizesemeny (id),
    regi_statusz       VARCHAR(20),
    uj_statusz         VARCHAR(20)  NOT NULL,
    valtoztatta_id     BIGINT       REFERENCES felhasznalo (id),
    megjegyzes         VARCHAR(500),
    idopont            TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_statusz_naplo_esemeny ON szervizesemeny_statusz_naplo (szervizesemeny_id, idopont);


CREATE TABLE munkalap (
    id                  BIGINT          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid                UUID            NOT NULL UNIQUE,
    szervizesemeny_id   BIGINT          NOT NULL UNIQUE REFERENCES szervizesemeny (id),
    keszitette_id       BIGINT          NOT NULL REFERENCES felhasznalo (id),
    elvegzett_munka     TEXT,
    megallapitott_hiba  TEXT,
    kezdes_idopont      TIMESTAMPTZ,
    befejezes_idopont   TIMESTAMPTZ,
    munkaora            NUMERIC(5,2),
    uzemora_allas       INT,
    alairas_fajl_ut     VARCHAR(500),
    alairo_nev          VARCHAR(255),
    azonositas_modja    azonositas_mod  NOT NULL DEFAULT 'KEZI',
    keszult_mobilon     TIMESTAMPTZ,
    letrehozva          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    modositva           TIMESTAMPTZ     NOT NULL DEFAULT now(),
    verzio              INT             NOT NULL DEFAULT 1,

    CONSTRAINT ck_munkalap_idorend CHECK (
        befejezes_idopont IS NULL OR kezdes_idopont IS NULL OR befejezes_idopont >= kezdes_idopont
    )
);

CREATE INDEX idx_munkalap_keszitette ON munkalap (keszitette_id);
CREATE INDEX idx_munkalap_modositva  ON munkalap (modositva);

CREATE TRIGGER trg_munkalap_modositva BEFORE UPDATE ON munkalap
    FOR EACH ROW EXECUTE FUNCTION set_modositva();



CREATE TABLE foto (
    id           BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid         UUID         NOT NULL UNIQUE,
    munkalap_id  BIGINT       NOT NULL REFERENCES munkalap (id),
    fajl_ut      VARCHAR(500) NOT NULL,
    eredeti_nev  VARCHAR(255),
    meret_byte   BIGINT,
    tipus        foto_tipus   NOT NULL DEFAULT 'ELVEGZETT_MUNKA',
    keszult      TIMESTAMPTZ,
    feltoltve    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_foto_munkalap ON foto (munkalap_id);



CREATE TABLE alkatresz (
    id          BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cikkszam    VARCHAR(100)  NOT NULL UNIQUE,
    megnevezes  VARCHAR(255)  NOT NULL,
    egyseg      VARCHAR(20)   NOT NULL DEFAULT 'db',
    egysegar    NUMERIC(12,2),
    aktiv       BOOLEAN       NOT NULL DEFAULT TRUE,
    letrehozva  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    modositva   TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_alkatresz_modositva ON alkatresz (modositva);

CREATE TRIGGER trg_alkatresz_modositva BEFORE UPDATE ON alkatresz
    FOR EACH ROW EXECUTE FUNCTION set_modositva();



CREATE TABLE alkatresz_felhasznalas (
    id                 BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid               UUID          NOT NULL UNIQUE,
    munkalap_id        BIGINT        NOT NULL REFERENCES munkalap (id),
    alkatresz_id       BIGINT        REFERENCES alkatresz (id),
    megnevezes_szabad  VARCHAR(255),
    mennyiseg          NUMERIC(10,3) NOT NULL,
    egysegar_akkor     NUMERIC(12,2),
    letrehozva         TIMESTAMPTZ   NOT NULL DEFAULT now(),

    CONSTRAINT ck_alkatresz_felh_azonositas CHECK (
        alkatresz_id IS NOT NULL OR megnevezes_szabad IS NOT NULL
    ),
    CONSTRAINT ck_alkatresz_felh_mennyiseg CHECK (mennyiseg > 0)
);

CREATE INDEX idx_alkatresz_felh_munkalap  ON alkatresz_felhasznalas (munkalap_id);
CREATE INDEX idx_alkatresz_felh_alkatresz ON alkatresz_felhasznalas (alkatresz_id);



CREATE VIEW v_gep_esedekesseg AS
SELECT
    g.id          AS gep_id,
    g.uuid        AS gep_uuid,
    g.sorozatszam,
    g.telephely_id,
    gt.karbantartas_ciklus_nap,
    gt.karbantartas_ciklus_uzemora,
    g.utolso_karbantartas_datum,
    g.utolso_karbantartas_uzemora,
    CASE WHEN gt.karbantartas_ciklus_nap IS NOT NULL
              AND g.utolso_karbantartas_datum IS NOT NULL
         THEN (g.utolso_karbantartas_datum + gt.karbantartas_ciklus_nap) - CURRENT_DATE
    END           AS hatralevo_nap,
    CASE WHEN gt.karbantartas_ciklus_uzemora IS NOT NULL
              AND g.utolso_karbantartas_uzemora IS NOT NULL
              AND g.uzemora IS NOT NULL
         THEN (g.utolso_karbantartas_uzemora + gt.karbantartas_ciklus_uzemora) - g.uzemora
    END           AS hatralevo_uzemora
FROM gep g
JOIN geptipus gt ON gt.id = g.geptipus_id
WHERE g.aktiv = TRUE;
