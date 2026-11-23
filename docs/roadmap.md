# Szerviz rendszer – projekt roadmap

**Csapat:** Levente + Domonkos (2 fő)
**Iteráció:** 2 hét, kezdés 2026. szeptember 14.
**Céldátum:** 2027. február 8. (leadás) — *a tényleges határidőt a vizsgaközponttól kell megerősíteni, legalább 14 nappal a vizsga előtt*

> **2026-11-14-i frissítés:** a technológiai pontokat a jelenlegi stackhez igazítottuk (PostgreSQL 16, C# / ASP.NET Core, Docker nélkül). **A dátumok még az eredeti tervből vannak, és nem tükrözik a tényleges haladást** (lásd lent az „Állapot" táblát). Az újratervezés külön feladat.
>
> **`[eldöntendő]`** jelöli azokat a pontokat, amikről még nincs döntés.

---

## Kritikus út

Ez a lánc határozza meg a projekt hosszát. Ha bármelyik elem csúszik, minden utána is csúszik:

**Adatmodell → C# backend + REST API → Mobil offline kliens → Integráció**

Ami NINCS a kritikus úton, tehát bármikor csúszhat vagy párhuzamosan mehet: HTML/CSS sablonok, publikus státuszoldal, web admin nagy része, Python eszközök, dokumentáció.

---

## Mérföldkövek

| # | Név | Eredeti határidő | Kész, ha |
|---|---|---|---|
| M1 | Adatmodell + alapozás | okt. 11. | PostgreSQL fut, séma áll, egy REST végpont válaszol |
| M2 | Backend REST API | nov. 22. | Minden végpont kész, auth működik, tesztek futnak |
| M3 | Web admin | dec. 20. | Diszpécser teljes munkafolyamata megy böngészőből |
| M4 | Mobil offline kliens | jan. 31. | Repülő üzemmódban végigvihető egy munkalap, majd szinkronizál |
| M5 | Integráció + leadás | feb. 8. | Dokumentáció, tesztek, dump, README kész |
| M6 | Python ML | *dátum nélkül* | Opcionális — csak ha M4 időben kész |

### Állapot (2026-11-14, a repó alapján)

| Elem | Állapot |
|---|---|
| Adatbázisséma (`V1__init.sql`, 12 tábla + nézet) | Kész |
| ERD | Kész |
| Seed adat (`V2__seed.sql`) | Nincs a repóban |
| C# backend váz, első végpont | Nincs a repóban |
| Web admin váz (React + Vite + TS, routing, layout) | Kész, az oldalak még üresek |
| Nyomtatható sablonok, publikus oldal | Nincs a repóban |
| Mobil (React Native + Expo) | Nincs elkezdve |

**Következmény:** az M1 egyik feltétele (működő REST végpont) még hiányzik, így az M2 (nov. 22.) az eredeti dátumon nem tartható. Ez az újratervezés fő bemenete.

---

## I1 · szept. 14–27. — Adatmodell

Az entitások, kapcsolatok és a státusz-állapotgép közös átbeszélése. Ez az egyetlen szakasz, amit nem lehet szétosztani, mert innen minden más következik.

- ERD ábra, export a `database/` alá
- PostgreSQL 16 telepítése a fejlesztőgépre (Docker nélkül, közvetlenül)
- `V1__init.sql` — a teljes séma
- Projekt scope dokumentum: mit csinál a rendszer, kinek, milyen szerepkörökkel
- Wireframe vázlat: web admin fő képernyők + mobil képernyők

**Kész, ha:** a `V1__init.sql` hiba nélkül lefut egy üres PostgreSQL adatbázison, és az ERD a repóban van.

---

## I2 · szept. 28 – okt. 11. — Backend alapok + statikus felületek

- ASP.NET Core Web API váz, PostgreSQL-kapcsolat (Npgsql)
- Adatelérési réteg: EF Core vagy Dapper `[eldöntendő]`
- Migrációs eszköz: külön SQL fájlok (`V1__`, `V2__` …) vagy EF Core migrációk `[eldöntendő]`
- Egy működő GET végpont (pl. `/api/gepek`)
- Seed adat (`V2__seed.sql`): legalább 20 gép, 3 telephely, egy inaktív tesztgép
- Nyomtatható munkalap sablon: statikus HTML + CSS, print stíluslappal, A4-re
- Nyomtatható szervizjelentés sablon

**Kész, ha:** Postmanből lekérhető a géplista JSON-ban, és a két HTML sablon nyomtatási előnézetben jól néz ki.

> **Ellenőrzőpont.** Ha itt még nem áll a C# váz, a hatókört kell szűkíteni (lásd a kockázatoknál). Az iskolai követelmény Java, C# vagy Node.js backendet enged.

---

## I3 · okt. 12–25. — CRUD végpontok

- Ügyfél, telephely, géptípus, gép: teljes CRUD (törlés = `aktiv = FALSE`)
- DTO réteg és bemeneti validáció
- Globális hibakezelés (egységes hibaválasz, pl. ProblemDetails)
- Első unit tesztek a service rétegre (xUnit vagy NUnit)
- Publikus státuszkövető oldal: kézzel írt HTML + CSS, kitalált adatokkal
- React projekt váz (Vite + TypeScript), routing, layout — *kész*

**Kész, ha:** minden alapentitáshoz van létrehozás, lekérdezés, módosítás, törlés, és legalább 5 teszt fut zölden.

---

## I4 · okt. 26 – nov. 8. — Szervizesemény és munkalap

- `szervizesemeny` végpontok + státusz-állapotgép szerveroldali kikényszerítése (érvénytelen átmenet → `409 Conflict`, minden váltás a státusznaplóba)
- `munkalap` végpontok, alkatrészfelhasználás
- Munkalap lezárásakor a `gep.utolso_karbantartas_*` mezők frissítése
- Fotó- és aláírásfeltöltés: multipart endpoint, fájlok a szerver fájlrendszerére
- **UUID-alapú létrehozás** — a kliens adja az azonosítót, idempotens feltöltés
- Optimista zárolás a `verzio` mezővel (`gep`, `szervizesemeny`, `munkalap`)
- Web admin: géplista és gépdetail képernyő valós API-ról

**Kész, ha:** végig lehet vinni egy szervizeseményt API-ból: létrehozás → kiosztás → munkalap → fotó → lezárás, és a gép esedékessége ezután frissül.

---

## I5 · nov. 9–22. — Auth és jogosultság

- Bejelentkezés: rövid életű access token (JWT) + hosszú életű refresh token, a refresh token hash-elve tárolva, visszavonható
- Megvalósítás: ASP.NET Core Identity vagy saját JWT + BCrypt `[eldöntendő]`
- Seed jelszó-hash placeholder (`CSERELD_LE`) cseréje valódi hash-re
- Szerepkörök: `DISZPECSER`, `SZERELO` — végpontszintű védelem
- A szerelő csak a saját munkáit látja
- Tesztek az auth rétegre
- Web admin: login képernyő, token kezelés, védett útvonalak
- Diszpécser munkakiosztó felület

**M2 kész, ha:** minden végpont kész, védett, és a Postman-kollekció a `docs/` alatt dokumentálja őket.

---

## I6 · nov. 23 – dec. 6. — Mobil váz

*Technológia: React Native + Expo. Követelmény: Android és iPhone, offline működés, lokális SQLite.*

- Expo projekt váz, futtatás saját telefonon Expo Go-val (Android és iPhone)
- **Első próba:** megy-e a sima HTTP-hívás a telefonról a laptopon futó backendre a helyi wifin
- Login, munkalista, gépdetail — **online módban**, offline még nem
- QR-olvasás kamerával (`expo-camera`), gép azonosítása `uuid` alapján
- Web admin: karbantartási esedékesség nézet (`v_gep_esedekesseg`), előzmények
- Dokumentáció váza: architektúra fejezet

**Kész, ha:** a telefonon be lehet lépni, látszik a napi munkalista, és QR-ral megnyitható egy gép.

---

## I7 · dec. 7–20. — Web admin lezárása

- Mobil: munkalap kitöltő űrlap, fotózás, aláírás ujjal a képernyőn
- Még mindig online módban
- Web admin befejezése
- A publikus státuszoldal és a nyomtatható sablonok bekötése valós API-ra

**M3 kész, ha:** a diszpécser teljes munkafolyamata végigmegy böngészőből.

> **Karácsonyi szünet: dec. 21 – jan. 3.** Ne tervezz rá. Ha kell, itt hozható be csúszás, de alapból pihenés.

---

## I8 · jan. 4–17. — Offline tárolás

**A projekt legnehezebb két hete.**

- Lokális SQLite séma a telefonon (`expo-sqlite`): munkalapok, fotók, gépadatok
- Napi csomag letöltése wifin (delta szinkron a `modositva` mező alapján), lokális mentés
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
- Hálózatérzékelés
- Dokumentáció: cél, komponensek, műszaki feltételek, használat
- Adatbázis dump exportálása (`pg_dump`)

**M4 kész, ha:** repülő be → munka → repülő ki → az adat megjelenik a web adminban.

---

## I10 · feb. 1–8. — Integráció és leadás

- Végigtesztelés, hibajavítás
- Mobil build: Android `.apk` (`eas build -p android --profile preview`) + futtatás iPhone-on Expo Go-val
- Teszteredmények dokumentálása
- README, telepítési útmutató (a bemutató gépre: adatbázis, backend, web admin, telefon csatlakoztatása)
- Főpróba a bemutató gépen: telefon a laptop backendjéhez wifin és tartalék hotspoton is
- Adatbázis dump frissítése
- Bemutató forgatókönyv begyakorlása, **képernyőfelvétel tartaléknak**
- Angol nyelvű összefoglaló megírása és begyakorlása — 3–5 perc, **mindkettőtöknek külön**

**M5 kész, ha:** a leadandó csomag hiánytalan.

---

## M6 · Python — csak ha marad idő

**Nem a kritikus úton van, és opcionális.** A rendszer Python nélkül is teljes, és nélküle is leadható.

**Első lépcső, ha a backend után marad idő:** CSV/Excel import CLI szkript (lásd projektleírás 7. pont), vizsgára elég verzióban: beolvasás, validálás, hibás sorok külön fájlba, duplikátumszűrés, fuzzy fejlécillesztés, beszúrás egy tranzakcióban. Becslés: 15–20 óra.

**Második lépcső, csak ha az M4 is időben kész:** karbantartás-előrejelzés.

- Feature-ök: eltelt idő az utolsó szerviz óta, hibagyakoriság, üzemóra
- scikit-learn modell, FastAPI végpont
- A predikció, a modell verziója és a valós kimenetel mentése PostgreSQL-be
- Web admin: kockázati sorrend nézet

---

## Leadandó csomag ellenőrzőlista

- [ ] Forráskód (teljes monorepo)
- [ ] Mobil telepítőcsomag (Android)
- [ ] Adatbázismodell-diagram
- [ ] Adatbázis export (dump)
- [ ] Szoftverdokumentáció: cél, komponensek technikai leírása, műszaki feltételek, használati bemutató
- [ ] Tesztkód
- [ ] Teszteredmények dokumentációja

---

## Kockázatok

| Kockázat | Mikor derül ki | Mit tegyetek |
|---|---|---|
| A C# backend nem áll össze időben | most (M1 még nyitott) | Hatókör szűkítése: először csak a teljes munkafolyamathoz szükséges végpontok, a többi utána |
| Az offline szinkron elhúzódik | I8 vége | Egyszerűsítés: csak munkalap megy offline, fotó nem |
| Egyenetlen haladás a két fél között | I5 | Újraosztás: a lemaradó dokumentációra és tesztre, a másik viszi a fejlesztést |
| A suli gépen nem fut a fejlesztői környezet (nincs PostgreSQL, .NET SDK bizonytalan) | most | Suliban DB nélküli munka: wireframe, sablonok, státuszoldal, dokumentáció |
| A vizsgahely wifije nem engedi, hogy a telefon elérje a laptopot | bemutató napján — ezért előre tesztelni | Tartalék: a laptop vagy a telefon hotspotja; képernyőfelvétel a működő szinkronról |
| Csúszik a leadás | folyamatosan | Csak `Opcionális` jelölésű issue-t dobjatok ki, `Kötelező`-t soha |

---

## Vizsgabemutató

Az adatmodellt és az API-szerződést mindkettőtöknek értenie kell. A vizsgán **mindkettőtöknek önállóan kell bemutatnia a saját részét magyarul és angolul is**, és a vizsgáztató rákérdez. Ezért mindkettőtöknek legyen egy egész, végigvihető vertikuma.
