import { Link, NavLink, Outlet } from 'react-router-dom'
import Ikon from '../components/Ikon'
import type { IkonNev } from '../components/Ikon'
import { Kezdobetuk } from '../components/Cimkek'
import { MA, bejelentkezett, munkalapok, szervizesemenyek } from '../data/mock'
import { ido } from '../utils/format'

interface Menupont {
  to: string
  felirat: string
  ikon: IkonNev
  szam?: number
}

// Darabszámok a menüben – élesben ezt egy /api/osszesito végpont adhatja
const kiosztatlan = szervizesemenyek.filter((e) => e.statusz === 'TERVEZETT').length
const lezarasraVar = szervizesemenyek.filter((e) => e.statusz === 'KESZ').length

const napiMunka: Menupont[] = [
  { to: '/', felirat: 'Áttekintés', ikon: 'attekintes' },
  { to: '/szervizesemenyek', felirat: 'Szervizesemények', ikon: 'munkalap', szam: lezarasraVar },
  { to: '/munkakiosztas', felirat: 'Munkakiosztás', ikon: 'kiosztas', szam: kiosztatlan },
  { to: '/esedekesseg', felirat: 'Esedékesség', ikon: 'naptar' },
]

const nyilvantartas: Menupont[] = [
  { to: '/gepek', felirat: 'Gépek', ikon: 'gep' },
  { to: '/ugyfelek', felirat: 'Ügyfelek', ikon: 'ugyfel' },
  { to: '/telephelyek', felirat: 'Telephelyek', ikon: 'telephely' },
]

// A legutóbb beérkezett munkalap ideje (a mobilról szinkronizálva)
const utolsoMunkalap = munkalapok
  .map((m) => m.keszult_mobilon)
  .filter((t) => t.startsWith(MA))
  .sort()
  .at(-1)

function MenuCsoport({ cim, pontok }: { cim: string; pontok: Menupont[] }) {
  return (
    <div className="nav__csoport">
      <span className="nav__cim">{cim}</span>
      {pontok.map((p) => (
        <NavLink key={p.to} to={p.to} end={p.to === '/'}>
          <Ikon nev={p.ikon} />
          {p.felirat}
          {p.szam ? <span className="nav__szam">{p.szam}</span> : null}
        </NavLink>
      ))}
    </div>
  )
}

export default function Layout() {
  return (
    <div className="menu">
      <aside className="sidebar">
        <Link to="/" className="marka">
          <span className="marka__jel" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="marka__nev">
            Szerviz rendszer
            <span className="marka__al">Diszpécser</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Főmenü">
          <MenuCsoport cim="Napi munka" pontok={napiMunka} />
          <MenuCsoport cim="Nyilvántartás" pontok={nyilvantartas} />
        </nav>

        <div className="sidebar__lab">
          {utolsoMunkalap && (
            <p className="szinkron">
              <Ikon nev="szinkron" meret={14} />
              Utolsó munkalap <span className="mono">{ido(utolsoMunkalap.slice(11))}</span>
            </p>
          )}
          <div className="felhasznalo">
            <Kezdobetuk nev={bejelentkezett.nev} />
            <div>
              <div className="felhasznalo__nev">{bejelentkezett.nev}</div>
              <div className="felhasznalo__szerep">Diszpécser</div>
            </div>
            <Link to="/login" className="felhasznalo__ki" aria-label="Kijelentkezés" title="Kijelentkezés">
              <Ikon nev="kilepes" />
            </Link>
          </div>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
