# Szerviz rendszer – projekt roadmap

**Csapat:** Levente + Domonkos (2 fő)
**Iteráció:** 2 hét, kezdés 2026. szeptember 14.
**Céldátum:** 2027. február 8. (leadás) — *a tényleges határidőt a vizsgaközponttól kell megerősíteni, legalább 14 nappal a vizsga előtt*

> A feladatfelosztás később kerül bele. Ez a dokumentum azt írja le, **mi épül mire és milyen sorrendben**.

---

## Kritikus út

Ez a lánc határozza meg a projekt hosszát. Ha bármelyik elem csúszik, minden utána is csúszik:

**Adatmodell → Spring backend + REST API → Mobil offline kliens → Integráció**

Ami NINCS a kritikus úton, tehát bármikor csúszhat vagy párhuzamosan mehet: HTML/CSS sablonok, publikus státuszoldal, web admin nagy része, Python ML, dokumentáció.

---

## Mérföldkövek

| # | Név | Határidő | Kész, ha |
|---|---|---|---|
| M1 | Adatmodell + alapozás | okt. 11. | MySQL fut, séma áll, egy REST végpont válaszol |
| M2 | Backend REST API | nov. 22. | Minden végpont kész, auth működik, tesztek futnak |
| M3 | Web admin | dec. 20. | Diszpécser teljes munkafolyamata megy böngészőből |
| M4 | Mobil offline kliens | jan. 31. | Repülő üzemmódban végigvihető egy munkalap, majd szinkronizál |
| M5 | Integráció + leadás | feb. 8. | Dokumentáció, tesztek, dump, README kész |
| M6 | Python ML | *dátum nélkül* | Opcionális — csak ha M4 időben kész |

---

## I1 · szept. 14–27. — Adatmodell

Az entitások, kapcsolatok és a státusz-állapotgép közös átbeszélése. Ez az egyetlen szakasz, amit nem lehet szétosztani, mert innen minden más következik.

- ERD ábra (dbdiagram.io), export a `/docs` alá
- Docker Compose MySQL 8-cal, `.env.example`
- Flyway `V1__init.sql` — a teljes séma
- Projekt scope dokumentum: mit csinál a rendszer, kinek, milyen szerepkörökkel
- Wireframe vázlat: web admin fő képernyők + mobil képernyők
- **Java alapozás indul** — osztályok, öröklődés, interfészek, collections

**Kész, ha:** `docker compose up` után a MySQL fut, a Flyway létrehozta az összes táblát, és az ERD a repóban van.

---

## I2 · szept. 28 – okt. 11. — Spring alapok + statikus felületek

- Spring Boot váz (Initializr: Web, JPA, MySQL, Flyway, Security, Validation)
- JPA entitások leképezése a sémára — `@Entity`, `@OneToMany`, `@ManyToOne`
- Repository réteg, egy működő GET végpont (pl. `/api/gepek`)
- Seed adat: 20 gép, 3 telephely
- Nyomtatható munkalap sablon: statikus HTML + CSS, print stíluslappal, A4-re
- Nyomtatható szervizjelentés sablon

**Kész, ha:** Postmanből lekérhető a géplista JSON-ban, és a két HTML sablon nyomtatási előnézetben jól néz ki.

> **Ellenőrzőpont.** Ha itt még nem áll a Spring váz, most kell dönteni a Node.js-re váltásról. Később már drága.

---

## I3 · okt. 12–25. — CRUD végpontok

- Ügyfél, telephely, géptípus, gép: teljes CRUD
- DTO réteg és validáció (`@Valid`)
- Globális hibakezelés (`@ControllerAdvice`)
- Első JUnit tesztek a service rétegre
- Publikus státuszkövető oldal: reszponzív HTML + CSS + Bootstrap, kitalált adatokkal
- React projekt váz (Vite + TypeScript), routing, layout

**Kész, ha:** minden alapentitáshoz van létrehozás, lekérdezés, módosítás, törlés, és legalább 5 teszt fut zölden.

---

## I4 · okt. 26 – nov. 8. — Szervizesemény és munkalap

- `Szervizesemeny` végpontok + státusz-állapotgép szerveroldali kikényszerítése
- `Munkalap` végpontok, alkatrészfelhasználás
- Fotófeltöltés: multipart endpoint, fájlok lokális filesystemre
- **UUID-alapú létrehozás** — a kliens adja az azonosítót, idempotens feltöltés
- Web admin: géplista és gépdetail képernyő valós API-ról

**Kész, ha:** végig lehet vinni egy szervizeseményt API-ból: létrehozás → kiosztás → munkalap → fotó → lezárás.

---

## I5 · nov. 9–22. — Auth és jogosultság

- Spring Security + saját JWT: login, token kiadás, lejárat, refresh
- Szerepkörök: `DISZPECSER`, `SZERELO` — végpontszintű védelem
- A szerelő csak a saját munkáit látja
- Tesztek az auth rétegre
- Web admin: login képernyő, token kezelés, védett útvonalak
- Diszpécser munkakiosztó felület

**M2 kész, ha:** minden végpont kész, védett, és a Postman-kollekció a `/docs` alatt dokumentálja őket.

---

## I6 · nov. 23 – dec. 6. — Mobil váz

- React Native + Expo projekt, futtatás saját telefonon Expo Go-val
- Login, munkalista, gépdetail — **online módban**, offline még nem
- QR-olvasás (`expo-camera`), gép azonosítása
- Web admin: karbantartási esedékesség nézet, előzmények
- Dokumentáció váza: architektúra fejezet

**Kész, ha:** a telefonon be lehet lépni, látszik a napi munkalista, és QR-ral megnyitható egy gép.

---

## I7 · dec. 7–20. — Web admin lezárása

- Mobil: munkalap kitöltő űrlap, fotózás, aláírás canvas-en (`react-native-signature-canvas`)
- Még mindig online módban
- Web admin befejezése
- A publikus státuszoldal és a nyomtatható sablonok bekötése valós API-ra

**M3 kész, ha:** a diszpécser teljes munkafolyamata végigmegy böngészőből.

> **Karácsonyi szünet: dec. 21 – jan. 3.** Ne tervezz rá. Ha kell, itt hozható be csúszás, de alapból pihenés.

---

## I8 · jan. 4–17. — Offline tárolás

**A projekt legnehezebb két hete.**

- `expo-sqlite` lokális séma: munkalapok, fotók, gépadatok
- Napi csomag letöltése wifin, lokális mentés
- Munkalap kitöltése és mentése **kizárólag lokálisan**, hálózat nélkül
- Szinkronizálatlan elemek listája a felületen
- Tesztdokumentáció szerkezete, tesztesetek leírása

**Kész, ha:** repülő üzemmódban végigvihető egy munkalap, és az adat a telefon újraindítása után is megvan.

---

## I9 · jan. 18–31. — Szinkronmotor

- Feltöltési sor: szinkronizálatlan elemek küldése, sikeres feltöltés jelölése
- Idempotencia: ugyanaz az UUID kétszer ne hozzon létre duplikátumot
- Konfliktuskezelés: **szerver nyer**, a telefon megmutatja a felülírt verziót
- Fotók feltöltése háttérben, újrapróbálkozással
- Hálózatérzékelés (`@react-native-community/netinfo`)
- Dokumentáció: cél, komponensek, műszaki feltételek, használat
- Adatbázis dump exportálása

**M4 kész, ha:** repülő be → munka → repülő ki → az adat megjelenik a web adminban.

---

## I10 · feb. 1–8. — Integráció és leadás

- Végigtesztelés, hibajavítás
- Android `.apk` build (`eas build -p android --profile preview`)
- Teszteredmények dokumentálása
- README, telepítési útmutató
- Adatbázis dump frissítése
- Bemutató forgatókönyv begyakorlása, **képernyőfelvétel tartaléknak**
- Angol nyelvű összefoglaló megírása és begyakorlása — 3–5 perc, **mindkettőtöknek külön**

**M5 kész, ha:** a leadandó csomag hiánytalan.

---

## M6 · Python ML — csak ha marad idő

**Nem a kritikus úton van.** Csak akkor kezdd, ha az M4 időben kész.

- Seed-adat generátor Pythonban (ez amúgy is hasznos, akár korábban is megírható)
- Feature-ök: eltelt idő az utolsó szerviz óta, hibagyakoriság, üzemóra
- scikit-learn modell, FastAPI végpont
- A predikció, a modell verziója és a valós kimenetel mentése MySQL-be
- Web admin: kockázati sorrend nézet

---

## Leadandó csomag ellenőrzőlista

- [ ] Forráskód (teljes monorepo)
- [ ] Android `.apk`
- [ ] Adatbázismodell-diagram
- [ ] Adatbázis export (dump)
- [ ] Szoftverdokumentáció: cél, komponensek technikai leírása, műszaki feltételek, használati bemutató
- [ ] Tesztkód
- [ ] Teszteredmények dokumentációja

---

## Kockázatok

| Kockázat | Mikor derül ki | Mit tegyetek |
|---|---|---|
| A Spring nem áll össze | I2 vége | Váltás Node.js + TypeScriptre, most még olcsó |
| Az offline szinkron elhúzódik | I8 vége | Egyszerűsítés: csak munkalap megy offline, fotó nem |
| Egyenetlen haladás a két fél között | I5 | Újraosztás: a lemaradó dokumentációra és tesztre, a másik viszi a fejlesztést |
| Csúszik a leadás | folyamatosan | Csak `Opcionális` jelölésű issue-t dobjatok ki, `Kötelező`-t soha |

---

## Nyitott kérdés

A feladatfelosztás. Amit érdemes szem előtt tartani, amikor eldöntitek: a vizsgán **mindkettőtöknek önállóan kell bemutatnia a saját részét magyarul és angolul is**, és a vizsgáztató rákérdez. Ezért olyan felosztás kell, ahol mindkettőtöknek van egy egész, végigvihető vertikuma — nem az, hogy valaki csak „a frontendes".
