// Típusok a database/V1__init.sql táblái alapján.
// A mezőnevek egyeznek az adatbázissal, hogy az API bekötésekor ne kelljen átnevezni.

export type Szerepkor = 'DISZPECSER' | 'SZERELO'
export type EsemenyTipus = 'TERVEZETT_KARBANTARTAS' | 'HIBABEJELENTES'
export type EsemenyStatusz = 'TERVEZETT' | 'KIOSZTOTT' | 'FOLYAMATBAN' | 'KESZ' | 'LEZART' | 'TOROLT'
export type Prioritas = 'ALACSONY' | 'NORMAL' | 'MAGAS' | 'SURGOS'
export type AzonositasMod = 'QR' | 'KEZI'

export interface Ugyfel {
  id: number
  nev: string
  adoszam: string
  kapcsolattarto_nev: string
  email: string
  telefon: string
}

export interface Telephely {
  id: number
  ugyfel_id: number
  nev: string
  cim: string
  varos: string
  iranyitoszam: string
  megjegyzes: string | null
}

export interface Geptipus {
  id: number
  gyarto: string
  tipusnev: string
  leiras: string
  karbantartas_ciklus_nap: number | null
  karbantartas_ciklus_uzemora: number | null
}

export interface Gep {
  id: number
  uuid: string
  geptipus_id: number
  telephely_id: number
  sorozatszam: string
  megnevezes: string
  telepites_datuma: string
  uzemora: number | null
  utolso_karbantartas_datum: string | null
  utolso_karbantartas_uzemora: number | null
}

export interface Felhasznalo {
  id: number
  nev: string
  email: string
  szerepkor: Szerepkor
  telefon: string
}

export interface Szervizesemeny {
  id: number
  uuid: string
  gep_id: number
  hozzarendelt_szerelo_id: number | null
  tipus: EsemenyTipus
  statusz: EsemenyStatusz
  prioritas: Prioritas
  bejelentett_hiba: string | null
  tervezett_datum: string
  tervezett_idopont: string | null
  /** NINCS a sémában – a napi idővonalhoz kell. Javaslat: becsult_munkaora NUMERIC(4,1) a szervizesemeny táblába */
  becsult_ora: number
}

export interface AlkatreszTetel {
  megnevezes: string
  cikkszam: string | null
  mennyiseg: number
  egyseg: string
  egysegar_akkor: number | null
}

export interface Munkalap {
  id: number
  uuid: string
  szervizesemeny_id: number
  keszitette_id: number
  elvegzett_munka: string
  megallapitott_hiba: string | null
  kezdes_idopont: string
  befejezes_idopont: string
  munkaora: number
  uzemora_allas: number | null
  alairo_nev: string
  azonositas_modja: AzonositasMod
  keszult_mobilon: string
  /** A foto tábla soraiból számolva */
  foto_db: number
  alkatreszek: AlkatreszTetel[]
}
