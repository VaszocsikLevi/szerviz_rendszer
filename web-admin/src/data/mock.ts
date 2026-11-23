// IDEIGLENES próbaadatok a dizájnhoz.
// Ha kész a backend, ezeket a tömböket az API-válaszok váltják (GET /api/ugyfelek, /api/gepek ...).
// A mezőnevek a V1__init.sql-lel egyeznek.

import type {
  Felhasznalo,
  Gep,
  Geptipus,
  Munkalap,
  Szervizesemeny,
  Telephely,
  Ugyfel,
} from './tipusok'

/** A próbaadatok "mai" napja, hogy a demó mindig ugyanígy nézzen ki. Élesben: new Date() */
export const MA = '2026-11-23'

export const bejelentkezett: Felhasznalo = {
  id: 1,
  nev: 'Kiss Réka',
  email: 'kiss.reka@szerviz.example',
  szerepkor: 'DISZPECSER',
  telefon: '+36 30 418 2275',
}

export const szerelok: Felhasznalo[] = [
  { id: 2, nev: 'Nagy Bence', email: 'nagy.bence@szerviz.example', szerepkor: 'SZERELO', telefon: '+36 30 512 8841' },
  { id: 3, nev: 'Horváth Gergő', email: 'horvath.gergo@szerviz.example', szerepkor: 'SZERELO', telefon: '+36 20 377 1904' },
  { id: 4, nev: 'Szabó Márton', email: 'szabo.marton@szerviz.example', szerepkor: 'SZERELO', telefon: '+36 70 634 2218' },
  { id: 5, nev: 'Tóth Dávid', email: 'toth.david@szerviz.example', szerepkor: 'SZERELO', telefon: '+36 30 905 4462' },
]

export const ugyfelek: Ugyfel[] = [
  { id: 1, nev: 'Fehérvári Fémmegmunkáló Kft.', adoszam: '25481937-2-07', kapcsolattarto_nev: 'Kovács Anna', email: 'kovacs.anna@fehervarifem.example', telefon: '+36 22 514 380' },
  { id: 2, nev: 'Mezőföld Malomipari Zrt.', adoszam: '13970524-2-07', kapcsolattarto_nev: 'Varga Péter', email: 'varga.peter@mezofoldmalom.example', telefon: '+36 25 460 912' },
  { id: 3, nev: 'Balatoni Hűtőház Kft.', adoszam: '22816043-2-14', kapcsolattarto_nev: 'Molnár Zsuzsanna', email: 'molnar.zsuzsanna@balatonihutohaz.example', telefon: '+36 84 312 657' },
  { id: 4, nev: 'Alba Pack Csomagolástechnika Kft.', adoszam: '26034718-2-07', kapcsolattarto_nev: 'Fekete László', email: 'fekete.laszlo@albapack.example', telefon: '+36 22 789 214' },
  { id: 5, nev: 'Móri Kőzúzó és Betonelem Kft.', adoszam: '11592846-2-07', kapcsolattarto_nev: 'Simon Gábor', email: 'simon.gabor@morikozuzo.example', telefon: '+36 22 407 553' },
]

export const telephelyek: Telephely[] = [
  { id: 1, ugyfel_id: 1, nev: 'Sóstói üzem', cim: 'Sóstói út', varos: 'Székesfehérvár', iranyitoszam: '8000', megjegyzes: 'Bejárat a 2-es kapun, a porta jelzi az érkezést' },
  { id: 2, ugyfel_id: 1, nev: 'Raktárbázis', cim: 'Kőrösi Csoma Sándor utca', varos: 'Székesfehérvár', iranyitoszam: '8000', megjegyzes: null },
  { id: 3, ugyfel_id: 2, nev: 'Sárbogárdi malom', cim: 'Ady Endre út', varos: 'Sárbogárd', iranyitoszam: '7000', megjegyzes: 'Kompresszorház a silók mögött' },
  { id: 4, ugyfel_id: 3, nev: 'Siófoki hűtőház', cim: 'Fő utca', varos: 'Siófok', iranyitoszam: '8600', megjegyzes: 'Hűtőtérbe csak kísérővel' },
  { id: 5, ugyfel_id: 4, nev: 'Gyártócsarnok', cim: 'Takarodó út', varos: 'Székesfehérvár', iranyitoszam: '8000', megjegyzes: null },
  { id: 6, ugyfel_id: 5, nev: 'Kőzúzó telep', cim: 'Dózsa György utca', varos: 'Mór', iranyitoszam: '8060', megjegyzes: 'A csarnokban nincs térerő' },
  { id: 7, ugyfel_id: 5, nev: 'Betonelem üzem', cim: 'Ipari park', varos: 'Mór', iranyitoszam: '8060', megjegyzes: null },
]

export const geptipusok: Geptipus[] = [
  { id: 1, gyarto: 'Atlas Copco', tipusnev: 'GA 37 VSD+', leiras: 'Olajkenésű csavarkompresszor', karbantartas_ciklus_nap: 365, karbantartas_ciklus_uzemora: 4000 },
  { id: 2, gyarto: 'Kaeser', tipusnev: 'ASD 50', leiras: 'Csavarkompresszor', karbantartas_ciklus_nap: 365, karbantartas_ciklus_uzemora: 3000 },
  { id: 3, gyarto: 'Grundfos', tipusnev: 'CR 32-4', leiras: 'Függőleges többlépcsős szivattyú', karbantartas_ciklus_nap: 365, karbantartas_ciklus_uzemora: null },
  { id: 4, gyarto: 'Jungheinrich', tipusnev: 'EFG 216', leiras: 'Elektromos homlokvillás targonca', karbantartas_ciklus_nap: 180, karbantartas_ciklus_uzemora: 500 },
  { id: 5, gyarto: 'Carrier', tipusnev: '30RB 120', leiras: 'Léghűtéses folyadékhűtő', karbantartas_ciklus_nap: 180, karbantartas_ciklus_uzemora: null },
  { id: 6, gyarto: 'Haas', tipusnev: 'VF-2', leiras: 'Függőleges CNC megmunkálóközpont', karbantartas_ciklus_nap: 365, karbantartas_ciklus_uzemora: 2000 },
  { id: 7, gyarto: 'Viessmann', tipusnev: 'Vitoplex 100', leiras: 'Gázüzemű kazán', karbantartas_ciklus_nap: 365, karbantartas_ciklus_uzemora: null },
]

export const gepek: Gep[] = [
  { id: 1, uuid: '3f8a2c91-6d4e-4b7a-9e15-0c2d8b7f4a63', geptipus_id: 1, telephely_id: 1, sorozatszam: 'API625318', megnevezes: 'Kompresszor 1 – présüzem', telepites_datuma: '2021-03-15', uzemora: 18420, utolso_karbantartas_datum: '2026-01-12', utolso_karbantartas_uzemora: 14610 },
  { id: 2, uuid: 'a71c4e08-2b93-4f6d-8a40-5e9c1d7b2f86', geptipus_id: 1, telephely_id: 3, sorozatszam: 'API631047', megnevezes: 'Kompresszor – malom', telepites_datuma: '2019-09-02', uzemora: 26930, utolso_karbantartas_datum: '2025-11-04', utolso_karbantartas_uzemora: 23150 },
  { id: 3, uuid: '5d2e9b47-8c1a-4e3f-b6d0-7a4f2c8e1b95', geptipus_id: 2, telephely_id: 5, sorozatszam: '1192/0457', megnevezes: 'Kompresszor 2 – csarnok', telepites_datuma: '2022-05-20', uzemora: 9840, utolso_karbantartas_datum: '2026-07-08', utolso_karbantartas_uzemora: 7120 },
  { id: 4, uuid: 'c84f1a36-0e7d-4b2c-9f58-3d6a1e9c7b20', geptipus_id: 3, telephely_id: 1, sorozatszam: '96416770-P1-1922', megnevezes: 'Hűtővíz szivattyú', telepites_datuma: '2020-04-01', uzemora: null, utolso_karbantartas_datum: '2026-03-10', utolso_karbantartas_uzemora: null },
  { id: 5, uuid: '9e6b3d72-4a1f-4c8e-a2b7-1f5d8c3e6a04', geptipus_id: 3, telephely_id: 4, sorozatszam: '96416770-P2-2117', megnevezes: 'Kondenzátor szivattyú', telepites_datuma: '2021-06-14', uzemora: null, utolso_karbantartas_datum: '2025-12-01', utolso_karbantartas_uzemora: null },
  { id: 6, uuid: '2b7f5e19-9c3d-4a6b-8e41-6c0a3f7d9e58', geptipus_id: 4, telephely_id: 2, sorozatszam: '91384522', megnevezes: 'Targonca 3', telepites_datuma: '2023-02-10', uzemora: 3310, utolso_karbantartas_datum: '2026-08-20', utolso_karbantartas_uzemora: 2850 },
  { id: 7, uuid: 'e03d8a64-1f5b-4e9c-b7a2-8d4c6e2f1a37', geptipus_id: 4, telephely_id: 2, sorozatszam: '91384601', megnevezes: 'Targonca 4', telepites_datuma: '2023-02-10', uzemora: 3105, utolso_karbantartas_datum: '2026-05-12', utolso_karbantartas_uzemora: 2540 },
  { id: 8, uuid: '6c1a9f83-7e2d-4b5a-9c06-4f8e1b3d7a92', geptipus_id: 5, telephely_id: 4, sorozatszam: '4913Q60218', megnevezes: 'Folyadékhűtő A', telepites_datuma: '2018-07-01', uzemora: null, utolso_karbantartas_datum: '2026-06-15', utolso_karbantartas_uzemora: null },
  { id: 9, uuid: '7f4e2b58-3a9c-4d1e-8b67-2e5c9a1f4d03', geptipus_id: 5, telephely_id: 4, sorozatszam: '4913Q60219', megnevezes: 'Folyadékhűtő B', telepites_datuma: '2018-07-01', uzemora: null, utolso_karbantartas_datum: '2026-09-03', utolso_karbantartas_uzemora: null },
  { id: 10, uuid: '1a9d6c25-5b8e-4f3a-a7c1-9e2b4d6f8c71', geptipus_id: 6, telephely_id: 1, sorozatszam: '1158342', megnevezes: 'CNC 2 – forgácsoló', telepites_datuma: '2020-11-23', uzemora: 11870, utolso_karbantartas_datum: '2026-04-14', utolso_karbantartas_uzemora: 10050 },
  { id: 11, uuid: '4e2c7a90-8d1b-4a6f-9e35-1b7d3f5a2c48', geptipus_id: 6, telephely_id: 1, sorozatszam: '1161907', megnevezes: 'CNC 4 – forgácsoló', telepites_datuma: '2021-08-30', uzemora: 9210, utolso_karbantartas_datum: '2026-11-20', utolso_karbantartas_uzemora: 9205 },
  { id: 12, uuid: 'b56e1d47-2c9a-4f8b-8d03-6a4e7c1b9f25', geptipus_id: 7, telephely_id: 5, sorozatszam: '7438291600215', megnevezes: 'Gázkazán – irodaház', telepites_datuma: '2017-10-05', uzemora: null, utolso_karbantartas_datum: '2025-10-28', utolso_karbantartas_uzemora: null },
  { id: 13, uuid: '8d3f6b12-9a4c-4e7d-b1e8-5c2a7f4d3b69', geptipus_id: 1, telephely_id: 6, sorozatszam: 'API640215', megnevezes: 'Kompresszor – kőzúzó', telepites_datuma: '2022-03-01', uzemora: 12480, utolso_karbantartas_datum: '2026-02-20', utolso_karbantartas_uzemora: 9100 },
  { id: 14, uuid: '0f7a4c85-6e2b-4d9a-a3c6-8b1e5d9f2a14', geptipus_id: 3, telephely_id: 7, sorozatszam: '96416770-P3-2304', megnevezes: 'Mosóvíz szivattyú', telepites_datuma: '2023-04-18', uzemora: null, utolso_karbantartas_datum: '2026-01-05', utolso_karbantartas_uzemora: null },
  { id: 15, uuid: 'd29b8e36-4f7a-4c1d-9b52-7e3a6c8d1f40', geptipus_id: 2, telephely_id: 7, sorozatszam: '1192/0612', megnevezes: 'Kompresszor – betonüzem', telepites_datuma: '2023-04-18', uzemora: 6120, utolso_karbantartas_datum: '2025-12-19', utolso_karbantartas_uzemora: 3580 },
]

export const szervizesemenyek: Szervizesemeny[] = [
  // ---- Mai munkák ----
  { id: 1, uuid: '7c2e4a19-3b8d-4f61-9a27-5e0c8d4b1f93', gep_id: 2, hozzarendelt_szerelo_id: 2, tipus: 'TERVEZETT_KARBANTARTAS', statusz: 'FOLYAMATBAN', prioritas: 'MAGAS', bejelentett_hiba: null, tervezett_datum: MA, tervezett_idopont: '07:30:00', becsult_ora: 3 },
  { id: 2, uuid: 'b3f81d6e-92a4-4c07-8e5b-1d7a3c9f2e48', gep_id: 15, hozzarendelt_szerelo_id: 2, tipus: 'TERVEZETT_KARBANTARTAS', statusz: 'KIOSZTOTT', prioritas: 'NORMAL', bejelentett_hiba: null, tervezett_datum: MA, tervezett_idopont: '13:00:00', becsult_ora: 2 },
  { id: 3, uuid: '4a9d2f7b-1e6c-4b38-a5d0-8f3e6b2c7a15', gep_id: 7, hozzarendelt_szerelo_id: 3, tipus: 'HIBABEJELENTES', statusz: 'KESZ', prioritas: 'SURGOS', bejelentett_hiba: 'Emelésnél rángat, a bal oldali emelőhengernél olaj szivárog', tervezett_datum: MA, tervezett_idopont: '08:00:00', becsult_ora: 2 },
  { id: 4, uuid: 'e6c03b85-7d1f-4a92-b4e6-2c8f5a1d9b70', gep_id: 6, hozzarendelt_szerelo_id: 3, tipus: 'TERVEZETT_KARBANTARTAS', statusz: 'FOLYAMATBAN', prioritas: 'NORMAL', bejelentett_hiba: null, tervezett_datum: MA, tervezett_idopont: '10:30:00', becsult_ora: 1.5 },
  { id: 5, uuid: '91d7f4a2-6b3e-4c85-9f10-4a2d7e8c3b56', gep_id: 10, hozzarendelt_szerelo_id: 3, tipus: 'TERVEZETT_KARBANTARTAS', statusz: 'KIOSZTOTT', prioritas: 'NORMAL', bejelentett_hiba: null, tervezett_datum: MA, tervezett_idopont: '13:30:00', becsult_ora: 3 },
  { id: 6, uuid: '2f5b8e1c-4d7a-4e93-8b62-9c1f3a6d0e27', gep_id: 8, hozzarendelt_szerelo_id: 4, tipus: 'HIBABEJELENTES', statusz: 'FOLYAMATBAN', prioritas: 'SURGOS', bejelentett_hiba: 'Magas nyomás hiba (A1), a 2-es kompresszor leold', tervezett_datum: MA, tervezett_idopont: '08:30:00', becsult_ora: 3 },
  { id: 7, uuid: 'c8a41e6f-0b2d-4f57-a9c3-6e4b1d8f2a91', gep_id: 5, hozzarendelt_szerelo_id: 4, tipus: 'TERVEZETT_KARBANTARTAS', statusz: 'KIOSZTOTT', prioritas: 'NORMAL', bejelentett_hiba: null, tervezett_datum: MA, tervezett_idopont: '13:00:00', becsult_ora: 2 },
  { id: 8, uuid: '5e7d2c94-8a1b-4d36-b0f8-3c9a5e2d7f14', gep_id: 12, hozzarendelt_szerelo_id: 5, tipus: 'TERVEZETT_KARBANTARTAS', statusz: 'KESZ', prioritas: 'MAGAS', bejelentett_hiba: null, tervezett_datum: MA, tervezett_idopont: '07:00:00', becsult_ora: 2.5 },
  { id: 9, uuid: 'a2b6f9d3-5c4e-4a18-9d72-1f8e3b6c4a05', gep_id: 3, hozzarendelt_szerelo_id: 5, tipus: 'TERVEZETT_KARBANTARTAS', statusz: 'KIOSZTOTT', prioritas: 'NORMAL', bejelentett_hiba: null, tervezett_datum: MA, tervezett_idopont: '11:00:00', becsult_ora: 2 },

  // ---- Kiosztásra vár ----
  { id: 10, uuid: 'd4e1a7c2-9f3b-4e65-8a04-7b2c6d9e1f38', gep_id: 13, hozzarendelt_szerelo_id: null, tipus: 'HIBABEJELENTES', statusz: 'TERVEZETT', prioritas: 'MAGAS', bejelentett_hiba: 'Olajköd a kifúvásnál, a kimenő hőmérséklet 102 °C', tervezett_datum: '2026-11-24', tervezett_idopont: null, becsult_ora: 2 },
  { id: 11, uuid: '6b9c3f8e-2a7d-4b14-9e56-0d3f8a2c5b79', gep_id: 9, hozzarendelt_szerelo_id: null, tipus: 'HIBABEJELENTES', statusz: 'TERVEZETT', prioritas: 'NORMAL', bejelentett_hiba: 'A ventilátor zörög indításkor', tervezett_datum: '2026-11-24', tervezett_idopont: null, becsult_ora: 1.5 },
  { id: 12, uuid: 'f1a8d5b3-7e2c-4f90-a6d1-5c8b2e7f4a63', gep_id: 1, hozzarendelt_szerelo_id: null, tipus: 'TERVEZETT_KARBANTARTAS', statusz: 'TERVEZETT', prioritas: 'NORMAL', bejelentett_hiba: null, tervezett_datum: '2026-11-25', tervezett_idopont: null, becsult_ora: 3 },
  { id: 13, uuid: '3c7e0b92-4d8f-4a61-b3e7-9a1d6f2c8e05', gep_id: 14, hozzarendelt_szerelo_id: null, tipus: 'TERVEZETT_KARBANTARTAS', statusz: 'TERVEZETT', prioritas: 'ALACSONY', bejelentett_hiba: null, tervezett_datum: '2026-11-26', tervezett_idopont: null, becsult_ora: 1 },

  // ---- Korábbi napok ----
  { id: 14, uuid: '8e2f6a41-1c9b-4d73-a8e0-6f4b9d1c3a27', gep_id: 11, hozzarendelt_szerelo_id: 4, tipus: 'TERVEZETT_KARBANTARTAS', statusz: 'KESZ', prioritas: 'NORMAL', bejelentett_hiba: null, tervezett_datum: '2026-11-20', tervezett_idopont: '09:00:00', becsult_ora: 3 },
  { id: 15, uuid: '0d5a9c37-6e1f-4b82-9c4d-2a7e5f8b1d64', gep_id: 4, hozzarendelt_szerelo_id: 5, tipus: 'HIBABEJELENTES', statusz: 'KESZ', prioritas: 'NORMAL', bejelentett_hiba: 'Tengelytömítésnél csöpög', tervezett_datum: '2026-11-21', tervezett_idopont: '10:00:00', becsult_ora: 1.5 },
  { id: 16, uuid: '9a3d7e15-2b6c-4f48-8d91-4e0a3c7b5f82', gep_id: 4, hozzarendelt_szerelo_id: null, tipus: 'TERVEZETT_KARBANTARTAS', statusz: 'TOROLT', prioritas: 'ALACSONY', bejelentett_hiba: null, tervezett_datum: '2026-11-18', tervezett_idopont: null, becsult_ora: 1 },
  { id: 17, uuid: '5f1c8b26-9d4a-4e37-b2a5-7c3e1f9d6b40', gep_id: 1, hozzarendelt_szerelo_id: 2, tipus: 'TERVEZETT_KARBANTARTAS', statusz: 'LEZART', prioritas: 'NORMAL', bejelentett_hiba: null, tervezett_datum: '2026-01-12', tervezett_idopont: '08:00:00', becsult_ora: 3 },
  { id: 18, uuid: 'c2e9a4f7-3b1d-4c58-9e06-8a5d2f7c1b93', gep_id: 1, hozzarendelt_szerelo_id: 3, tipus: 'HIBABEJELENTES', statusz: 'LEZART', prioritas: 'SURGOS', bejelentett_hiba: 'Túlmelegedés miatt leáll, hibakód: E0103', tervezett_datum: '2025-08-21', tervezett_idopont: '10:00:00', becsult_ora: 2 },
  { id: 19, uuid: '7b4d1f83-6a2e-4b95-a0c7-3e8f6b2d9a14', gep_id: 1, hozzarendelt_szerelo_id: 2, tipus: 'TERVEZETT_KARBANTARTAS', statusz: 'LEZART', prioritas: 'NORMAL', bejelentett_hiba: null, tervezett_datum: '2025-01-15', tervezett_idopont: '08:00:00', becsult_ora: 3 },
  { id: 20, uuid: 'e8f3c6a2-0d7b-4a19-8c54-1b6e9d3f7a28', gep_id: 10, hozzarendelt_szerelo_id: 3, tipus: 'TERVEZETT_KARBANTARTAS', statusz: 'LEZART', prioritas: 'NORMAL', bejelentett_hiba: null, tervezett_datum: '2026-04-14', tervezett_idopont: '08:00:00', becsult_ora: 3 },
  { id: 21, uuid: '1d6b9e47-8c3a-4f02-b5d8-6a1c4e9f3b75', gep_id: 8, hozzarendelt_szerelo_id: 4, tipus: 'TERVEZETT_KARBANTARTAS', statusz: 'LEZART', prioritas: 'NORMAL', bejelentett_hiba: null, tervezett_datum: '2026-06-15', tervezett_idopont: '09:00:00', becsult_ora: 3 },
]

export const munkalapok: Munkalap[] = [
  {
    id: 1, uuid: 'aa31f7c2-5e8d-4b19-9c6a-2f4e8b1d7c53', szervizesemeny_id: 3, keszitette_id: 3,
    elvegzett_munka: 'Bal emelőhenger tömítéskészlet csere, hidraulikaolaj utántöltés, emelési próba teljes terheléssel',
    megallapitott_hiba: 'Kopott dugattyútömítés a bal emelőhengerben',
    kezdes_idopont: '2026-11-23T08:10:00', befejezes_idopont: '2026-11-23T09:55:00', munkaora: 1.75, uzemora_allas: 3105,
    alairo_nev: 'Kovács Anna', azonositas_modja: 'QR', keszult_mobilon: '2026-11-23T09:58:00', foto_db: 4,
    alkatreszek: [
      { megnevezes: 'Emelőhenger tömítéskészlet', cikkszam: 'JH-51027384', mennyiseg: 1, egyseg: 'készlet', egysegar_akkor: 38400 },
      { megnevezes: 'Hidraulikaolaj HLP 46', cikkszam: 'HLP46-20', mennyiseg: 4, egyseg: 'l', egysegar_akkor: 2150 },
    ],
  },
  {
    id: 2, uuid: 'bb52e8d3-6f9a-4c27-8d1b-3a5f9c2e8d64', szervizesemeny_id: 8, keszitette_id: 5,
    elvegzett_munka: 'Égőfej tisztítás, ionizációs elektróda csere, füstgázmérés, biztonsági szelep ellenőrzés',
    megallapitott_hiba: null,
    kezdes_idopont: '2026-11-23T07:05:00', befejezes_idopont: '2026-11-23T09:20:00', munkaora: 2.25, uzemora_allas: null,
    alairo_nev: 'Fekete László', azonositas_modja: 'QR', keszult_mobilon: '2026-11-23T09:24:00', foto_db: 3,
    alkatreszek: [
      { megnevezes: 'Ionizációs elektróda', cikkszam: 'VI-7828596', mennyiseg: 1, egyseg: 'db', egysegar_akkor: 12900 },
    ],
  },
  {
    id: 3, uuid: 'cc73f9e4-7a1b-4d38-9e2c-4b6a1d3f9e75', szervizesemeny_id: 14, keszitette_id: 4,
    elvegzett_munka: 'Orsókenő-rendszer szűrőcsere, hűtőfolyadék csere, tengelyek hézagmérése, éves karbantartás',
    megallapitott_hiba: null,
    kezdes_idopont: '2026-11-20T09:05:00', befejezes_idopont: '2026-11-20T12:15:00', munkaora: 3.25, uzemora_allas: 9205,
    alairo_nev: 'Kovács Anna', azonositas_modja: 'QR', keszult_mobilon: '2026-11-20T12:20:00', foto_db: 2,
    alkatreszek: [
      { megnevezes: 'Kenőolaj szűrőbetét', cikkszam: 'HA-58-2731', mennyiseg: 1, egyseg: 'db', egysegar_akkor: 9600 },
      { megnevezes: 'Hűtő-kenő emulzió', cikkszam: 'EM-200', mennyiseg: 20, egyseg: 'l', egysegar_akkor: 1480 },
    ],
  },
  {
    id: 4, uuid: 'dd94a1f5-8b2c-4e49-af3d-5c7b2e4a1f86', szervizesemeny_id: 15, keszitette_id: 5,
    elvegzett_munka: 'Csúszógyűrűs tengelytömítés csere, szivárgáspróba üzemi nyomáson',
    megallapitott_hiba: 'Kopott tengelytömítés',
    kezdes_idopont: '2026-11-21T10:10:00', befejezes_idopont: '2026-11-21T11:30:00', munkaora: 1.25, uzemora_allas: null,
    alairo_nev: 'Kovács Anna', azonositas_modja: 'KEZI', keszult_mobilon: '2026-11-21T11:34:00', foto_db: 2,
    alkatreszek: [
      { megnevezes: 'Tengelytömítés HQQE 32', cikkszam: 'GR-96525458', mennyiseg: 1, egyseg: 'db', egysegar_akkor: 46800 },
    ],
  },
  {
    id: 5, uuid: 'ee15b2a6-9c3d-4f5a-b04e-6d8c3f5b2a97', szervizesemeny_id: 17, keszitette_id: 2,
    elvegzett_munka: 'Olajcsere, olajszűrő, levegőszűrő és olajleválasztó betét csere, szíjfeszesség ellenőrzés',
    megallapitott_hiba: null,
    kezdes_idopont: '2026-01-12T08:05:00', befejezes_idopont: '2026-01-12T10:50:00', munkaora: 2.75, uzemora_allas: 14610,
    alairo_nev: 'Kovács Anna', azonositas_modja: 'QR', keszult_mobilon: '2026-01-12T10:55:00', foto_db: 3,
    alkatreszek: [
      { megnevezes: 'Roto-Xtend kompresszorolaj', cikkszam: '2901-1700-00', mennyiseg: 20, egyseg: 'l', egysegar_akkor: 6800 },
      { megnevezes: 'Olajszűrő', cikkszam: '1625-7525-00', mennyiseg: 1, egyseg: 'db', egysegar_akkor: 14500 },
      { megnevezes: 'Levegőszűrő betét', cikkszam: '1613-9500-00', mennyiseg: 1, egyseg: 'db', egysegar_akkor: 21900 },
      { megnevezes: 'Olajleválasztó betét', cikkszam: '1625-1651-00', mennyiseg: 1, egyseg: 'db', egysegar_akkor: 58200 },
    ],
  },
  {
    id: 6, uuid: 'ff26c3b7-0d4e-4a6b-8c5f-7e9d4a6c3b08', szervizesemeny_id: 18, keszitette_id: 3,
    elvegzett_munka: 'Hűtőradiátor tisztítás sűrített levegővel, termosztát szelep csere, próbaüzem 2 órán át',
    megallapitott_hiba: 'Elszennyeződött hűtő és beragadt termosztát szelep',
    kezdes_idopont: '2025-08-21T10:15:00', befejezes_idopont: '2025-08-21T12:40:00', munkaora: 2.5, uzemora_allas: 13240,
    alairo_nev: 'Kovács Anna', azonositas_modja: 'QR', keszult_mobilon: '2025-08-21T12:44:00', foto_db: 5,
    alkatreszek: [
      { megnevezes: 'Termosztát szelep betét', cikkszam: '1622-8579-00', mennyiseg: 1, egyseg: 'db', egysegar_akkor: 32600 },
    ],
  },
  {
    id: 7, uuid: '1a37d4c8-1e5f-4b7c-9d60-8f0e5b7d4c19', szervizesemeny_id: 19, keszitette_id: 2,
    elvegzett_munka: 'Éves karbantartás: olaj, olajszűrő, levegőszűrő csere, biztonsági szelep ellenőrzés',
    megallapitott_hiba: null,
    kezdes_idopont: '2025-01-15T08:00:00', befejezes_idopont: '2025-01-15T10:30:00', munkaora: 2.5, uzemora_allas: 10580,
    alairo_nev: 'Kovács Anna', azonositas_modja: 'KEZI', keszult_mobilon: '2025-01-15T10:36:00', foto_db: 2,
    alkatreszek: [
      { megnevezes: 'Roto-Xtend kompresszorolaj', cikkszam: '2901-1700-00', mennyiseg: 20, egyseg: 'l', egysegar_akkor: 6400 },
      { megnevezes: 'Olajszűrő', cikkszam: '1625-7525-00', mennyiseg: 1, egyseg: 'db', egysegar_akkor: 13900 },
    ],
  },
]

// ---------- Kereső segédfüggvények ----------
// Élesben ezek helyett az API adja vissza a kapcsolt adatokat (JOIN), itt kézzel keressük ki.

export const gepById = (id: number) => gepek.find((g) => g.id === id)!
export const gepByUuid = (uuid: string) => gepek.find((g) => g.uuid === uuid)
export const geptipusById = (id: number) => geptipusok.find((t) => t.id === id)!
export const telephelyById = (id: number) => telephelyek.find((t) => t.id === id)!
export const ugyfelById = (id: number) => ugyfelek.find((u) => u.id === id)!
export const szereloById = (id: number | null) => (id === null ? undefined : szerelok.find((s) => s.id === id))
export const munkalapByEsemeny = (esemenyId: number) => munkalapok.find((m) => m.szervizesemeny_id === esemenyId)

/** A géphez tartozó telephely és ügyfél egyben */
export function gepHelye(gep: Gep) {
  const telephely = telephelyById(gep.telephely_id)
  const ugyfel = ugyfelById(telephely.ugyfel_id)
  return { telephely, ugyfel }
}
