# szerviz_rendszer

Karbantartás-előrejelző terepi szerviz rendszer ipari gépekkel foglalkozó vállalkozásoknak, ahol a szervizmunkát ma jellemzően papíron vagy Excelben vezetik.

*Technikusi vizsgaremek — Szoftverfejlesztő és -tesztelő technikus, Széchenyi István Technikum, Székesfehérvár. Készítők: Vaszócsik Levente, Domonkos.*

## Mit tud

- **Diszpécser (web admin, böngésző):** ügyfelek, telephelyek, gépek felvitele; munkák kiosztása a szerelőknek; esedékes karbantartások követése; szervizesemények lezárása.
- **Szerelő (mobilapp, Android és iPhone):** napi munkák, gépazonosítás QR-kóddal, munkalap kitöltése fotóval, alkatrészekkel és aláírással — **térerő nélkül is**, a telefon később szinkronizál.
- **Ügyfél (publikus oldal):** bejelentkezés nélkül, azonosító alapján megnézheti, hol tart a javítás.

Minden gépnek digitális előélete van, és a rendszer gépenként számolja, mikor esedékes a következő karbantartás (naptári idő és üzemóra alapján, amelyik előbb lejár).

## Felépítés

| Komponens | Technológia | Mappa | Állapot |
|---|---|---|---|
| Adatbázis | PostgreSQL 16 | `database/` | Séma kész |
| Backend API | C# / ASP.NET Core | — | Tervezve |
| Web admin | React + Vite + TypeScript | `web-admin/` | Folyamatban |
| Mobilapp | React Native + Expo (offline, lokális SQLite) | — | Tervezve |
| Publikus oldal, nyomtatható sablonok | HTML + CSS | — | Tervezve |
| Adatimport | Python CLI szkript | — | Tervezve |

A rendszer saját gépen fut, előfizetéses felhőszolgáltatás nélkül: az adatbázis, a backend és a web admin egy laptopon, a mobilapp a helyi wifin csatlakozik hozzá.

## Dokumentáció

- [Projektleírás](docs/projektleiras.md) — a probléma, a szerepkörök, az offline működés, az adatmodell és az állapotgép
- [Roadmap](docs/roadmap.md) — mérföldkövek, iterációk, kockázatok
- [Adatbázisséma](database/V1__init.sql) és [ERD](database/szerviz_diagram.png)

## Futtatás fejlesztéshez

**Adatbázis** (PostgreSQL 16 telepítve):

```bash
createdb szerviz
psql -d szerviz -f database/V1__init.sql
```

**Web admin** (Node.js szükséges):

```bash
cd web-admin
npm install
npm run dev
```
