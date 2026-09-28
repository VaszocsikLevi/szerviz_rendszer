# szerviz_rendszer

A projekt egy ipari gépekkel, berendezésekkel foglalkozó vállalkozásoknak, cégeknek a rendszere, amely a szervízmunka nyilvántartására jellemzően pappíron vagy Exelben vezetik.

A rendszer 2 felületet foglal magába:
1. a diszpécser felülete amelyen nyomonköveti, a munkafolyamatokat, irányítja a szerelőket és ellenörzi a karbantartási időket. illetve az ügyfeleket viszi fel gépekkel. 
2. a szerelő mobilos nézete, itt látja a napi munkáit, QR-al azonosítja a gépeket és kitölti a munkanaplóját.
3. A karbantartások esedékessége nincs követve. Vagy túl gyakran mennek ki, vagy akkor, amikor már elromlott.
A rendszer erre ad választ: minden gépnek van egy digitális előélete, amit a szerelő a helyszínen, telefonról elér és bővít — akkor is, ha nincs térerő.

2. Kik használják
Szerepkör	Hol	Mit csinál
Diszpécser	irodában, böngészőben	felviszi az ügyfeleket, telephelyeket, gépeket; kiosztja a munkákat; látja az esedékes karbantartásokat; lezárja a szervizeseményeket
Szerelő	terepen, telefonon	látja a napi munkáit, QR-ral azonosítja a gépet, kitölti a munkalapot, fotóz, aláírat
Ügyfél	bárhol, böngészőben	egy publikus oldalon, azonosító alapján megnézi, hol tart a javítás (bejelentkezés nélkül)
3. Hogyan működik – egy nap a szerelő szemével
Reggel, irodában vagy otthon wifin: a szerelő megnyitja a mobilappot, és letölti a napi munkacsomagot. Ez tartalmazza a mai munkáit, a hozzájuk tartozó gépek adatait és a korábbi szervizelőzményeket.
Kiér a telephelyre, ahol lehet, hogy nincs térerő (pince, csarnok, ipari terület).
Beolvassa a gépen lévő QR-kódot. A telefon a saját lokális adatbázisából előhozza a gép teljes előéletét.
Elvégzi a munkát, közben fotóz, rögzíti a felhasznált alkatrészeket, leírja, mit csinált, beírja a munkaidőt.
Az ügyfél ujjal aláír a képernyőn.
Minden a telefonon marad, amíg nincs hálózat.
Amikor lesz térerő, az app automatikusan feltölti a szerverre: munkalapok, fotók, aláírások.
A diszpécser a webes felületen látja a beérkezett munkalapot, és lezárja a szervizeseményt.
Az ügyfél a publikus oldalon látja, hogy elkészült.
4. Mit jelent technikailag az offline
Ez a rendszer legfontosabb és legnehezebb része, ezért érdemes közösen tisztán érteni.

A telefonon van egy saját, kis adatbázis (SQLite), ami a szerver adatainak egy részét tárolja. Két irány van:

Letöltés (szerver → telefon). Amikor van hálózat, az app lekéri a szerelőhöz tartozó munkákat és gépadatokat, és elmenti lokálisan.

Feltöltés (telefon → szerver). Amit a szerelő offline rögzít, az lokálisan mentődik szinkronizálatlan jelöléssel. Amikor visszatér a hálózat, az app egyenként felküldi őket, és sikeres feltöltés után átjelöli szinkronizált-ra.

Két szabály, amit be kell tartanunk az adatmodellben
a) A telefon adja az azonosítót. A munkalap már a telefonon megkapja a végleges azonosítóját (UUID), mert offline nem tudja megkérdezni a szervert. Ezért minden táblában, amit a mobil hoz létre, kell egy UUID mező az auto-increment ID mellé.

b) Ütközésnél a szerver nyer. Ha ugyanazt a rekordot a diszpécser is módosította, amíg a szerelő offline volt, akkor a szerver változata marad érvényben, és a telefon megmutatja a szerelőnek, hogy a módosítása felülíródott. Ehhez minden rekordon kell egy verzio mező, amit módosításkor növelünk.

Ez így egyszerűbb, mint az általános megoldás, és a vizsgán meg lehet indokolni, miért ezt választottuk.

5. Rendszerkomponensek
[ Mobil app ]  ──HTTP──┐
  React Native          │
  + lokális SQLite      │
                        v
[ Web admin ] ──HTTP──> [ Backend API ] ──> [ MySQL ]
  React                   Spring Boot
                            │
                            v
                     [ Python szolgáltatás ]
                       FastAPI (opcionális)
[ Publikus oldal ]
  statikus HTML/CSS ──HTTP──> Backend API
Komponens	Mit csinál
Backend API	Az egyetlen, ami az adatbázishoz nyúl. Minden más rajta keresztül dolgozik.
MySQL	A rendszer igazsága. Minden végleges adat itt van.
Web admin	A diszpécser felülete. Csak online működik.
Mobil app	A szerelő felülete. Offline is működik, saját lokális adatbázissal.
Publikus oldal	Kézzel írt HTML/CSS. Csak olvas, azonosító alapján.
Python eszközök	Adatimport bevezetéskor, seed-adat generálás, később karbantartás-előrejelzés. A rendszer nélkülük is teljes.
6. Adatmodell – ez az SQL alapja
Ez a rész javaslat, nem végleges. Ezen kell végigmennünk együtt, mezőnként.

Táblánként, javasolt mezőkkel
ugyfel — a megrendelő cég id, nev, adoszam, kapcsolattarto_nev, email, telefon, letrehozva

telephely — ahol a gépek fizikailag vannak id, ugyfel_id (FK), nev, cim, varos, iranyitoszam, megjegyzes

geptipus — a típus hordozza a karbantartási szabályt, nem az egyedi gép id, gyarto, tipusnev, leiras, karbantartas_ciklus_nap, karbantartas_ciklus_uzemora

Megbeszélendő: lehet mindkettő kitöltve? Ha igen, melyik esedékesség számít — amelyik előbb eljön?

gep — az egyedi példány id, uuid, geptipus_id (FK), telephely_id (FK), sorozatszam, qr_kod, telepites_datuma, uzemora, aktiv, letrehozva, modositva

Megbeszélendő: a qr_kod legyen külön mező, vagy elég a uuid-t belekódolni a QR-be? Az utóbbi egyszerűbb.

felhasznalo id, email, jelszo_hash, nev, szerepkor (DISZPECSER / SZERELO), telefon, aktiv, letrehozva

szervizesemeny — egy kiszállás vagy munka id, uuid, gep_id (FK), hozzarendelt_szerelo_id (FK, nullable), tipus (TERVEZETT_KARBANTARTAS / HIBABEJELENTES), statusz, bejelentett_hiba, tervezett_datum, prioritas, letrehozva, modositva, verzio

munkalap — amit a szerelő a helyszínen kitölt id, uuid, szervizesemeny_id (FK), elvegzett_munka, megallapitott_hiba, kezdes_idopont, befejezes_idopont, munkaora, alairas_kep (base64 vagy fájlút), alairo_nev, letrehozva_mobilon, szinkronizalva, verzio

foto id, uuid, munkalap_id (FK), fajl_ut, tipus (HIBA / ELVEGZETT_MUNKA), keszult, feltoltve

alkatresz — egyszerű katalógus, nem teljes készletkezelés id, cikkszam, megnevezes, egyseg, egysegar

alkatresz_felhasznalas id, uuid, munkalap_id (FK), alkatresz_id (FK), mennyiseg

Az állapotgép
A szervizesemeny.statusz értékei és az engedélyezett átmenetek:

TERVEZETT ──> KIOSZTOTT ──> FOLYAMATBAN ──> KESZ ──> LEZART
Átmenet	Ki válthatja	Mikor
TERVEZETT → KIOSZTOTT	diszpécser	szerelő hozzárendelésekor
KIOSZTOTT → FOLYAMATBAN	szerelő	amikor elkezdi a munkát
FOLYAMATBAN → KESZ	szerelő	munkalap beküldésekor
KESZ → LEZART	diszpécser	ellenőrzés után
bármi → TOROLT	diszpécser	lemondás esetén
Ezt a szabályt a backendnek kell kikényszerítenie — nem elég a felületen letiltani a gombot.

7. Adatmigráció – hogyan kerül be a meglévő nyilvántartás
A rendszer bevezetésekor az ügyfélnél már ott van 100–300 gép Excelben vagy papíron. Ezt kézzel begépelni nem reális, tehát kell egy betöltési út.

Fontos szétválasztani két dolgot:

Mi ez	Hogyan oldjuk meg
Folyamatos adatfelvitel	a diszpécser új ügyfelet, telephelyet, gépet visz fel	az admin felület CRUD funkciói — ez amúgy is kész az I4-re
Kezdeti betöltés (migráció)	egyszeri, nagy tömegű adat behozása bevezetéskor	Python CLI import szkript
Miért CLI szkript, és nem feltöltő felület
Az admin felületre épített CSV-importőr szebb, de fél iterációnyi munka: fájlfeltöltés, oszlopmegfeleltető felület, soronkénti validáció, hibás sorok kezelése, duplikátumszűrés. A scope védelme miatt ez most kimarad.

Helyette parancssorból futtatható Python szkript, pandas + openpyxl alapon. Három okból ez a jó döntés:

Ez tartja a Pythont a stackben akkor is, ha az ML rész kimarad.
Ugyanez a szkript adja a seed-adatot a saját teszteléshez. Az I1-ben amúgy is kell 20 gép és 3 telephely — ha mindjárt importőrként írjuk meg, kétszer hasznosul.
A valóságban is így megy. Az adatmigráció egyszeri, szakértelmet igénylő művelet, nem végfelhasználói funkció. Ez a bemutatón megindokolható.
Mit tud a szkript
Excel (.xlsx) és CSV bemenet
Fuzzy fejlécillesztés: felismeri, hogy a Gyártási szám, Sorozatszám, S/N, Serial mind ugyanaz az oszlop. Karakterlánc-hasonlóság alapján, nem ML-lel.
Típusfelismerés mintákkal: dátumformátumok, számok, irányítószám
Soronkénti validáció, a hibás sorok külön hibafájlba
Duplikátumszűrés sorozatszám alapján
Bizonytalanság esetén visszakérdez, nem talál ki
Miért nem ML ez
Felmerült, hogy az oszlopfelismerést tanuló modell végezze. Két okból nem:

Ami itt kell, azt szabályalapon jobban meg lehet oldani. A fejlécillesztés determinisztikus, megmagyarázható, és hibátlanul működik. Egy modell ugyanerre kevésbé megbízható lenne.

Ami valóban ML-t igényelne — a fejléc nélküli, kaotikus táblák értelmezése az oszlopok tartalmából —, ahhoz sok valós, rendezetlen Excel-tábla kellene tanítóadatnak. Ilyen nincs, és szintetikusan generálva a modell csak azt tanulná meg, amit mi generáltunk.

Elv az egész projektre: ha egy problémára van működő szabályalapú megoldás, ML-t rátenni nem érdem, hanem hiba. A valódi ML oda kerül, ahol az adat magától keletkezik — a karbantartás-előrejelzéshez, ahol a rendszer saját szervizelőzménye a tanítóhalmaz.
