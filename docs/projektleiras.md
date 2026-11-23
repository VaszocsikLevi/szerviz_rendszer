# Szerviz rendszer – projektleírás

*Közös munkadokumentum. Az a célja, hogy mindketten ugyanazt értsük a rendszer alatt. Utolsó frissítés: 2026-11-14. Az adatmodell végleges, a forrása a `database/V1__init.sql`. Ahol ez a leírás és az SQL eltér, az SQL a mérvadó.*

> **`[eldöntendő]`** jelöli azokat a pontokat, amikről még nincs döntés. Ezeket ne tekintsük késznek.

---

## 1. Milyen problémát old meg

Ipari gépeket, berendezéseket karbantartó és javító vállalkozásoknál a szervizmunka nyilvántartása jellemzően papíron és Excelben megy. Ebből három probléma következik:

1. **A szerelő a helyszínen nem tudja, mi volt korábban a géppel.** Nincs nála az előzmény, telefonálnia kell, vagy vakon dolgozik.
2. **A munkalap papíron készül**, utólag valakinek be kell gépelnie, és közben elveszik vagy elmosódik.
3. **A karbantartások esedékessége nincs követve.** Vagy túl gyakran mennek ki, vagy akkor, amikor már elromlott.

A rendszer erre ad választ: minden gépnek van egy digitális előélete, amit a szerelő a helyszínen, telefonról elér és bővít — **akkor is, ha nincs térerő**.

---

## 2. Kik használják

| Szerepkör | Hol | Mit csinál |
|---|---|---|
| **Diszpécser** | irodában, böngészőben (desktop) | felviszi az ügyfeleket, telephelyeket, gépeket; kiosztja a munkákat; látja az esedékes karbantartásokat; lezárja a szervizeseményeket |
| **Szerelő** | terepen, telefonon (Android és iPhone) | látja a napi munkáit, QR-ral azonosítja a gépet, kitölti a munkalapot, fotóz, aláírat |
| **Ügyfél** | bárhol, böngészőben | egy publikus oldalon, azonosító alapján megnézi, hol tart a javítás (bejelentkezés nélkül) |

---

## 3. Hogyan működik – egy nap a szerelő szemével

1. **Reggel, irodában vagy otthon wifin:** a szerelő megnyitja a mobilappot, és letölti a napi munkacsomagot. Ez tartalmazza a mai munkáit, a hozzájuk tartozó gépek adatait és a korábbi szervizelőzményeket.
2. **Kiér a telephelyre**, ahol lehet, hogy nincs térerő (pince, csarnok, ipari terület).
3. **Beolvassa a gépen lévő QR-kódot.** A telefon a *saját lokális adatbázisából* előhozza a gép teljes előéletét.
4. **Elvégzi a munkát**, közben fotóz, rögzíti a felhasznált alkatrészeket és a gép üzemóra-állását, leírja, mit csinált, beírja a munkaidőt.
5. **Az ügyfél ujjal aláír** a képernyőn.
6. **Minden a telefonon marad**, amíg nincs hálózat.
7. **Amikor lesz térerő**, az app automatikusan feltölti a szerverre: munkalapok, fotók, aláírások.
8. **A diszpécser** a webes felületen látja a beérkezett munkalapot, és lezárja a szervizeseményt.
9. **Az ügyfél** a publikus oldalon látja, hogy elkészült.

---

## 4. Mit jelent technikailag az offline

Ez a rendszer legfontosabb és legnehezebb része, ezért érdemes közösen tisztán érteni.

A telefonon van egy **saját, kis adatbázis** (SQLite), ami a szerver adatainak egy részét tárolja. Két irány van:

**Letöltés (szerver → telefon).** Amikor van hálózat, az app lekéri a szerelőhöz tartozó munkákat és gépadatokat, és elmenti lokálisan. Csak a legutóbbi szinkron óta változott sorokat kéri le (delta szinkron), ehhez minden szinkronizált táblán van `modositva` mező és index rajta. A `modositva` mezőt egy adatbázis-trigger tölti ki minden módosításkor.

**Feltöltés (telefon → szerver).** Amit a szerelő offline rögzít, az lokálisan mentődik `szinkronizálatlan` jelöléssel. Amikor visszatér a hálózat, az app egyenként felküldi őket, és sikeres feltöltés után átjelöli `szinkronizált`-ra. (Ez a jelölés csak a telefon lokális adatbázisában létezik, a szerveren nincs rá mező.)

### Három szabály, amit az adatmodell betart

**a) A telefon adja az azonosítót.** A munkalap már a telefonon megkapja a végleges azonosítóját (UUID), mert offline nem tudja megkérdezni a szervert. Ezért minden táblában, amit a mobil hoz létre (`szervizesemeny`, `munkalap`, `foto`, `alkatresz_felhasznalas`, illetve a `gep`), van egy `uuid` mező az auto-increment `id` mellett. Ebből következik, hogy **a feltöltés idempotens**: ha a megszakadt feltöltést a telefon újrapróbálja, ugyanazzal az uuid-val nem jön létre duplikátum.

**b) Ütközésnél a szerver nyer.** Ha ugyanazt a rekordot a diszpécser is módosította, amíg a szerelő offline volt, akkor a szerver változata marad érvényben, és a telefon megmutatja a szerelőnek, hogy a módosítása felülíródott. Ehhez van `verzio` mező (optimista zárolás), de **csak azokon a táblákon, amiket a mobil módosíthat: `gep`, `szervizesemeny`, `munkalap`.** A `foto` és az `alkatresz_felhasznalas` csak beszúrás, ott az uuid-alapú idempotencia elég.

**c) Két óra, két mező.** A telefon órája pontatlan lehet, ezért külön tároljuk, mikor készült valami a telefonon, és mikor ért be a szerverre: `munkalap.keszult_mobilon` / `letrehozva`, `foto.keszult` / `feltoltve`.

Ez így egyszerűbb, mint az általános megoldás, és a vizsgán meg lehet indokolni, miért ezt választottuk.

---

## 5. Rendszerkomponensek

```
[ Mobil app ]  ──HTTP──┐
  React Native + Expo   │
  + lokális SQLite      │
                        ▼
[ Web admin ] ──HTTP──▶ [ Backend API ] ──▶ [ PostgreSQL 16 ]
  React + Vite + TS       C# / ASP.NET Core
                                                  ▲
[ Publikus oldal ]                                │
  kézzel írt HTML/CSS ──HTTP──▶ Backend API       │
                                                  │
[ Python eszközök ] ── adatimport, seed ──────────┘
```

| Komponens | Technológia | Mit csinál |
|---|---|---|
| **Backend API** | C# / ASP.NET Core | Az egyetlen, ami az adatbázishoz nyúl (a Python importszkripten kívül). Minden más rajta keresztül dolgozik. Itt él az üzleti logika, pl. az állapotgép. |
| **Adatbázis** | PostgreSQL 16 | A rendszer igazsága. Minden végleges adat itt van. |
| **Web admin** | React + Vite + TypeScript | A diszpécser felülete. Csak online működik, csak desktopra készül. |
| **Mobil app** | React Native + Expo, `expo-sqlite` | A szerelő felülete, Androidon és iPhone-on. Offline is működik, saját lokális adatbázissal. |
| **Publikus oldal** | kézzel írt HTML + CSS | Csak olvas, azonosító alapján. |
| **Python eszközök** | Python | **Opcionális.** Adatimport bevezetéskor (CLI szkript, ld. 7. pont), később esetleg karbantartás-előrejelzés. Csak akkor készül el, ha a kötelező részek után marad idő. A rendszer nélküle is teljes. |

**Üzemeltetés:** a rendszer saját gépen fut, előfizetéses felhőszolgáltatás nélkül. A vizsgán a saját gépünkről mutatjuk be: az adatbázis, a backend és a web admin egy laptopon fut, a telefon a helyi wifin keresztül éri el a backendet. Ezért a mobilapp szerver-címe beállítható, nincs beégetve.

---

## 6. Adatmodell

12 tábla és 1 nézet. A teljes definíció a `database/V1__init.sql`-ben, az ábra a `database/szerviz_diagram.png`-ben van.

### Entitások és kapcsolataik

```
Ugyfel ──1:N──▶ Telephely ──1:N──▶ Gep
                                    │
Geptipus ──1:N──▶ Gep               │
                                    ▼
                            Szervizesemeny ──1:1──▶ Munkalap
                               │    ▲                  │
                               │    │                  ├──1:N──▶ Foto
                               │    │                  └──1:N──▶ AlkatreszFelhasznalas ──N:1──▶ Alkatresz
                               │    │
                               │  Felhasznalo (hozzárendelt szerelő, létrehozó)
                               │    │
                               │    └──1:N──▶ RefreshToken
                               ▼
                 SzervizesemenyStatuszNaplo
```

### Táblák

**`ugyfel`** — a megrendelő cég
`id`, `nev`, `adoszam`, `kapcsolattarto_nev`, `email`, `telefon`, `aktiv`, `letrehozva`, `modositva`

**`telephely`** — ahol a gépek fizikailag vannak
`id`, `ugyfel_id` (FK), `nev`, `cim`, `varos`, `iranyitoszam`, `megjegyzes`, `aktiv`, `letrehozva`, `modositva`

**`geptipus`** — a típus hordozza a karbantartási szabályt, nem az egyedi gép
`id`, `gyarto`, `tipusnev`, `leiras`, `karbantartas_ciklus_nap`, `karbantartas_ciklus_uzemora`, `aktiv`, `letrehozva`, `modositva`
- A `(gyarto, tipusnev)` páros egyedi. Mindkét ciklus opcionális, de ha ki van töltve, pozitív.
- **Miért itt, és nem a gépen?** Ha a szabály a gépen lenne, egy típus ciklusának változásakor 40 gépnél 40 sort kellene átírni, és ha egy kimarad, ellentmondásos lesz az adat (módosítási anomália).

**`gep`** — az egyedi példány
`id`, `uuid`, `geptipus_id` (FK), `telephely_id` (FK), `sorozatszam` (egyedi), `megnevezes`, `telepites_datuma`, `uzemora`, `utolso_karbantartas_datum`, `utolso_karbantartas_uzemora`, `aktiv`, `letrehozva`, `modositva`, `verzio`
- **A QR-kód tartalma a gép `uuid`-ja**, ezért nincs külön `qr_kod` mező.
- Az `utolso_karbantartas_*` mezők **tudatos denormalizáció** (gyorsítótár): a munkalap lezárásakor kell frissíteni őket. Ha a lezárás ezt kihagyja, a gép örökre lejártnak látszik. Ez a rendszer leggyakoribb hibalehetősége.

**`felhasznalo`**
`id`, `email` (egyedi), `jelszo_hash`, `nev`, `szerepkor` (`DISZPECSER` / `SZERELO`), `telefon`, `aktiv`, `letrehozva`, `modositva`

**`refresh_token`** — a bejelentkezés megújításához
`id`, `felhasznalo_id` (FK), `token_hash`, `lejar`, `visszavonva`, `letrehozva`
- A token **csak hash-elve** van tárolva, és visszavonható. Rövid életű access token + hosszú életű refresh token a modell.

**`szervizesemeny`** — egy kiszállás vagy munka
`id`, `uuid`, `gep_id` (FK), `hozzarendelt_szerelo_id` (FK, nullable), `letrehozta_id` (FK), `tipus` (`TERVEZETT_KARBANTARTAS` / `HIBABEJELENTES`), `statusz`, `prioritas` (`ALACSONY` / `NORMAL` / `MAGAS` / `SURGOS`), `bejelentett_hiba`, `tervezett_datum`, `tervezett_idopont`, `letrehozva`, `modositva`, `verzio`

**`szervizesemeny_statusz_naplo`** — minden státuszváltás nyoma
`id`, `szervizesemeny_id` (FK), `regi_statusz`, `uj_statusz`, `valtoztatta_id` (FK), `megjegyzes`, `idopont`

**`munkalap`** — amit a szerelő a helyszínen kitölt (szervizeseményenként legfeljebb egy)
`id`, `uuid`, `szervizesemeny_id` (FK, egyedi), `keszitette_id` (FK), `elvegzett_munka`, `megallapitott_hiba`, `kezdes_idopont`, `befejezes_idopont`, `munkaora`, `uzemora_allas`, `alairas_fajl_ut`, `alairo_nev`, `azonositas_modja` (`QR` / `KEZI`), `keszult_mobilon`, `letrehozva`, `modositva`, `verzio`
- A befejezés nem lehet a kezdés előtt (`CHECK`).
- Az `azonositas_modja` mutatja, hogy a szerelő QR-ral vagy kézzel azonosította a gépet.

**`foto`**
`id`, `uuid`, `munkalap_id` (FK), `fajl_ut`, `eredeti_nev`, `meret_byte`, `tipus` (`HIBA` / `ELVEGZETT_MUNKA`), `keszult`, `feltoltve`

**`alkatresz`** — egyszerű katalógus, nem készletkezelés
`id`, `cikkszam` (egyedi), `megnevezes`, `egyseg`, `egysegar`, `aktiv`, `letrehozva`, `modositva`

**`alkatresz_felhasznalas`**
`id`, `uuid`, `munkalap_id` (FK), `alkatresz_id` (FK, nullable), `megnevezes_szabad`, `mennyiseg`, `egysegar_akkor`, `letrehozva`
- Vagy katalógustétel (`alkatresz_id`), vagy szabad szöveg (`megnevezes_szabad`), ezt `CHECK` kényszeríti ki. A mennyiség pozitív.
- Az `egysegar_akkor` a felhasználáskori ár. Utólag nem írjuk át, így a katalógusár változása nem írja át a régi munkalapokat.

### Nézet: `v_gep_esedekesseg`

Gépenként kiszámolja, mennyi van hátra a következő karbantartásig: `hatralevo_nap` és `hatralevo_uzemora`. **A negatív érték azt jelenti, hogy lejárt.** Ha egy géptípusnak mindkét ciklusa ki van töltve, **az számít, amelyik előbb lejár.** Csak az aktív gépeket mutatja. Nincs tárolt „esedékes" mező, mert az elavulna, ezért mindig a nézet számol.

### Általános szabályok

- **Pénz = `NUMERIC`, idő = `TIMESTAMPTZ`.** Lebegőpontos szám pénzre nem jó, időzóna nélküli időbélyeg pedig offline szinkronnál félrevezető.
- **Törlés:** a törzsadatokat (`ugyfel`, `telephely`, `geptipus`, `gep`, `felhasznalo`, `alkatresz`) nem töröljük fizikailag, hanem `aktiv = FALSE`-ra állítjuk. Ok: ha egy offline telefon olyan gépre tölt fel munkalapot, amit közben töröltek, fizikai törlésnél az idegen kulcs miatt a feltöltés elveszne. A szervizeseményt a `TOROLT` státusz „törli".
- **Fájlok** (fotó, aláírás): az adatbázisban csak a fájlút van, maga a fájl a szerver fájlrendszerén. Egy feltöltési útvonal mindkettőre, base64 nincs az adatbázisban.

### Az állapotgép

A `szervizesemeny.statusz` értékei és az engedélyezett átmenetek:

```
TERVEZETT ──▶ KIOSZTOTT ──▶ FOLYAMATBAN ──▶ KESZ ──▶ LEZART
    │              │
    └──────────────┴──▶ TOROLT
```

| Átmenet | Ki válthatja | Mikor |
|---|---|---|
| `TERVEZETT → KIOSZTOTT` | diszpécser | szerelő hozzárendelésekor |
| `KIOSZTOTT → FOLYAMATBAN` | szerelő | amikor elkezdi a munkát |
| `FOLYAMATBAN → KESZ` | szerelő | munkalap beküldésekor |
| `KESZ → LEZART` | diszpécser | ellenőrzés után |
| bármi → `TOROLT` | diszpécser | lemondás esetén |

Ezt a szabályt **a backendnek kell kikényszerítenie**, nem elég a felületen letiltani a gombot. Érvénytelen átmenetre a backend `409 Conflict` választ ad. Minden sikeres váltás bekerül a `szervizesemeny_statusz_naplo` táblába, így utólag bizonyítható, ki mikor mit váltott.

---

## 7. Adatmigráció – hogyan kerül be a meglévő nyilvántartás

A rendszer bevezetésekor az ügyfélnél már ott van 100–300 gép Excelben vagy papíron. Ezt kézzel begépelni nem reális, tehát kell egy betöltési út.

Fontos szétválasztani két dolgot:

| | Mi ez | Hogyan oldjuk meg |
|---|---|---|
| **Folyamatos adatfelvitel** | a diszpécser új ügyfelet, telephelyet, gépet visz fel | az admin felület CRUD funkciói |
| **Kezdeti betöltés (migráció)** | egyszeri, nagy tömegű adat behozása bevezetéskor | **Python CLI import szkript** |

### Miért CLI szkript, és nem feltöltő felület

Az admin felületre épített CSV-importőr szebb, de fél iterációnyi munka: fájlfeltöltés, oszlopmegfeleltető felület, soronkénti validáció, hibás sorok kezelése, duplikátumszűrés. A scope védelme miatt ez most kimarad.

Helyette parancssorból futtatható Python szkript, `pandas` + `openpyxl` alapon. Három okból ez a jó döntés:

1. **Ez tartja a Pythont a stackben** akkor is, ha más Python-rész nem készül el.
2. **Ugyanez a szkript adhatja a seed-adatot** a saját teszteléshez, így kétszer hasznosul.
3. **A valóságban is így megy.** Az adatmigráció egyszeri, szakértelmet igénylő művelet, nem végfelhasználói funkció. Ez a bemutatón megindokolható.

### Mit tud a szkript

- Excel (`.xlsx`) és CSV bemenet
- **Fuzzy fejlécillesztés:** felismeri, hogy a `Gyártási szám`, `Sorozatszám`, `S/N`, `Serial` mind ugyanaz az oszlop. Karakterlánc-hasonlóság alapján, nem ML-lel.
- Típusfelismerés mintákkal: dátumformátumok, számok, irányítószám
- Soronkénti validáció, a hibás sorok külön hibafájlba
- Duplikátumszűrés sorozatszám alapján
- Bizonytalanság esetén visszakérdez, nem talál ki

### Miért nem ML ez

Felmerült, hogy az oszlopfelismerést tanuló modell végezze. Két okból nem:

**Ami itt kell, azt szabályalapon jobban meg lehet oldani.** A fejlécillesztés determinisztikus, megmagyarázható, és hibátlanul működik. Egy modell ugyanerre kevésbé megbízható lenne.

**Ami valóban ML-t igényelne** — a fejléc nélküli, kaotikus táblák értelmezése az oszlopok tartalmából —, ahhoz sok valós, rendezetlen Excel-tábla kellene tanítóadatnak. Ilyen nincs, és szintetikusan generálva a modell csak azt tanulná meg, amit mi generáltunk.

> **Elv az egész projektre:** ha egy problémára van működő szabályalapú megoldás, ML-t rátenni nem érdem, hanem hiba. A valódi ML oda kerülhet, ahol az adat magától keletkezik — a karbantartás-előrejelzéshez, ahol a rendszer saját szervizelőzménye a tanítóhalmaz.

---

## 8. Meghozott adatmodell-döntések

Ezek a kérdések az SQL megírása előtt nyitottak voltak, mostanra mind eldőlt:

| Kérdés | Döntés |
|---|---|
| Karbantartási ciklus: nap, üzemóra, vagy mindkettő? | Mindkettő lehet, az számít, amelyik előbb lejár. |
| Üzemóra frissítése | A szerelő a munkalapon rögzíti (`munkalap.uzemora_allas`). |
| Fotók tárolása | Fájlrendszeren, az adatbázisban csak az útvonal. |
| Aláírás | Képfájlként, ugyanazon a feltöltési úton, mint a fotók (`alairas_fajl_ut`). |
| Alkatrészek | Katalógus, de szabad szöveges tétel is megengedett. |
| Törlés | Soft delete (`aktiv`) a törzsadatokon, `TOROLT` státusz a szervizeseményen. |
| QR-kód | A gép `uuid`-ja, nincs külön mező. |
| Publikus státuszoldal azonosítója | `[eldöntendő]` — a javaslat a `szervizesemeny.uuid`, mert kitalálhatatlan. |

---

## 9. Amit tudatosan kihagyunk

Ez fontos, mert a scope védelme dönti el, hogy elkészül-e. Ezek **nem** részei a rendszernek:

- CSV/Excel importőr felület az admin oldalon (helyette Python CLI szkript, ld. 7. pont)
- Teljes készletkezelés raktárkészlettel és beszerzéssel
- Számlázás és árajánlat
- Garanciakövetés
- Jelszó-visszaállítás
- Több cég kiszolgálása egy rendszerben (multi-tenant)
- Push értesítések
- A web admin mobilos nézete (csak desktop)

Ha szorít az idő, **a fotók offline támogatása feláldozható, a munkalap offline működése nem.** Nem cél egy 100%-ban valósághű szervizalkalmazás: egy teljes munkafolyamatnak kell hibátlanul működnie.

Ha ezek bármelyike felmerül menet közben, a válasz alapból nem.

---

## 10. Következő lépés

Az adatmodell kész (`V1__init.sql`). Következik a C# backend váza és az első végpont, majd a seed-adat (`V2__seed.sql`) lefuttatása és ellenőrzése. Párhuzamosan mehetnek a HTML sablonok, a publikus státuszoldal és a web admin képernyői.
