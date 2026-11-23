import { useState } from 'react'
import { Link } from 'react-router-dom'
import OldalFejlec from '../components/OldalFejlec'
import Ikon from '../components/Ikon'
import { CiklusSav, EsedekessegCimke, Kezdobetuk, PrioritasCimke } from '../components/Cimkek'
import {
  MA,
  gepById,
  gepHelye,
  gepek,
  munkalapByEsemeny,
  szerelok,
  szereloById,
  szervizesemenyek,
} from '../data/mock'
import { legnagyobbArany, szamolEsedekesseg } from '../data/esedekesseg'
import { statuszFelirat, tipusFelirat } from '../data/cimkek'
import type { Szervizesemeny } from '../data/tipusok'
import { hosszuDatum, ido, napHozzaad, rovidDatum, szam } from '../utils/format'
import './Dashboard.css'

// Az idővonal 7 és 17 óra között
const NAP_ELEJE = 7
const NAP_VEGE = 17
const NAP_HOSSZ = NAP_VEGE - NAP_ELEJE
/** A próbaadatokhoz rögzített "most". Élesben: new Date() */
const MOST = '10:20'

const oraTizedes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number)
  return h + m / 60
}

/** Az idővonal blokkjának helye: a munkalap valós ideje, ha van, különben a terv */
const blokkHelye = (e: Szervizesemeny) => {
  const lap = munkalapByEsemeny(e.id)
  const kezd = lap ? oraTizedes(lap.kezdes_idopont.slice(11, 16)) : oraTizedes(e.tervezett_idopont ?? '08:00')
  const hossz = lap ? lap.munkaora : e.becsult_ora
  return {
    left: ((kezd - NAP_ELEJE) / NAP_HOSSZ) * 100,
    width: (hossz / NAP_HOSSZ) * 100,
    kezdes: lap ? lap.kezdes_idopont.slice(11, 16) : ido(e.tervezett_idopont),
  }
}

const Dashboard = () => {
  // Lezárt munkák az oldalon belül – élesben: PATCH /api/szervizesemenyek/{uuid}/statusz
  const [lezartak, setLezartak] = useState<number[]>([])

  const maiak = szervizesemenyek.filter((e) => e.tervezett_datum === MA && e.hozzarendelt_szerelo_id !== null)
  const folyamatban = maiak.filter((e) => e.statusz === 'FOLYAMATBAN').length
  const maiKesz = maiak.filter((e) => e.statusz === 'KESZ').length

  const lezarasra = szervizesemenyek.filter((e) => e.statusz === 'KESZ')
  const kiosztatlan = szervizesemenyek.filter((e) => e.statusz === 'TERVEZETT')
  const holnapra = kiosztatlan.filter((e) => e.tervezett_datum === napHozzaad(MA, 1)).length

  const esedekes = gepek
    .map((g) => ({ gep: g, e: szamolEsedekesseg(g) }))
    .sort((a, b) => legnagyobbArany(b.e) - legnagyobbArany(a.e))
  const lejartak = esedekes.filter((x) => x.e.allapot === 'lejart')
  const legregebbi = Math.max(...lejartak.map((x) => -(x.e.hatralevo_nap ?? 0)))

  const mostPoz = ((oraTizedes(MOST) - NAP_ELEJE) / NAP_HOSSZ) * 100
  const orak = Array.from({ length: NAP_HOSSZ + 1 }, (_, i) => NAP_ELEJE + i)

  return (
    <div className="oldal">
      <OldalFejlec cim="Áttekintés" alcim={hosszuDatum(MA)}>
        <Link to="/szervizesemenyek" className="gomb gomb--fo">
          <Ikon nev="plusz" />
          Új szervizesemény
        </Link>
      </OldalFejlec>

      <section className="statsor" aria-label="Összesítés">
        <div className="stat">
          <span className="stat__cim">Mai munkák</span>
          <span className="stat__ertek">{maiak.length}</span>
          <span className="stat__meta">
            {folyamatban} folyamatban, {maiKesz} kész
          </span>
        </div>
        <Link to="/szervizesemenyek" className="stat">
          <span className="stat__cim">Lezárásra vár</span>
          <span className="stat__ertek">{lezarasra.length - lezartak.length}</span>
          <span className="stat__meta">Beérkezett munkalap</span>
        </Link>
        <Link to="/esedekesseg" className="stat stat--riaszto">
          <span className="stat__cim">Lejárt karbantartás</span>
          <span className="stat__ertek">{lejartak.length}</span>
          <span className="stat__meta">A legrégebbi {legregebbi} napja</span>
        </Link>
        <Link to="/munkakiosztas" className="stat">
          <span className="stat__cim">Kiosztásra vár</span>
          <span className="stat__ertek">{kiosztatlan.length}</span>
          <span className="stat__meta">{holnapra} holnapra tervezve</span>
        </Link>
      </section>

      {/* ---- A nap idővonala szerelőnként ---- */}
      <section className="kartya" aria-labelledby="idovonal-cim">
        <div className="kartya__fej">
          <h2 id="idovonal-cim">Mai munkák szerelőnként</h2>
          <div className="jelmagyarazat">
            {(['KIOSZTOTT', 'FOLYAMATBAN', 'KESZ'] as const).map((s) => (
              <span key={s} className={`jelmagyarazat__elem blokk--${s.toLowerCase()}`}>
                <span className="jelmagyarazat__minta" />
                {statuszFelirat[s]}
              </span>
            ))}
          </div>
        </div>

        <div className="idovonal">
          <div className="idovonal__sor idovonal__sor--fejlec">
            <div />
            <div className="idovonal__savja">
              {orak.map((o) => (
                <span key={o} className="idovonal__ora" style={{ left: `${((o - NAP_ELEJE) / NAP_HOSSZ) * 100}%` }}>
                  {String(o).padStart(2, '0')}:00
                </span>
              ))}
            </div>
          </div>

          {szerelok.map((sz) => {
            const munkai = maiak.filter((e) => e.hozzarendelt_szerelo_id === sz.id)
            const ossz = munkai.reduce((n, e) => n + e.becsult_ora, 0)
            return (
              <div key={sz.id} className="idovonal__sor">
                <div className="idovonal__szerelo">
                  <Kezdobetuk nev={sz.nev} />
                  <div>
                    <div className="cella__fo">{sz.nev}</div>
                    <div className="cella__al">
                      {munkai.length} munka, {szam(ossz)} óra
                    </div>
                  </div>
                </div>
                <div className="idovonal__savja idovonal__savja--racs">
                  {orak.slice(1, -1).map((o) => (
                    <span key={o} className="idovonal__vonal" style={{ left: `${((o - NAP_ELEJE) / NAP_HOSSZ) * 100}%` }} />
                  ))}
                  {munkai.map((e) => {
                    const gep = gepById(e.gep_id)
                    const { ugyfel } = gepHelye(gep)
                    const hely = blokkHelye(e)
                    return (
                      <Link
                        key={e.id}
                        to={`/gepek/${gep.uuid}`}
                        className={`blokk blokk--${e.statusz.toLowerCase()}`}
                        style={{ left: `${hely.left}%`, width: `${hely.width}%` }}
                        title={`${hely.kezdes} ${gep.megnevezes} – ${ugyfel.nev} (${statuszFelirat[e.statusz]})`}
                      >
                        <span className="blokk__ido mono">
                          {hely.kezdes}
                          {e.tipus === 'HIBABEJELENTES' && <Ikon nev="figyelem" meret={12} />}
                        </span>
                        <span className="blokk__cim">{gep.megnevezes}</span>
                        <span className="blokk__al">{ugyfel.nev}</span>
                      </Link>
                    )
                  })}
                  <span className="idovonal__most" style={{ left: `${mostPoz}%` }} aria-hidden="true" />
                </div>
              </div>
            )
          })}
          <div className="idovonal__sor idovonal__sor--lab">
            <div />
            <div className="idovonal__savja">
              <span className="idovonal__most-cimke mono" style={{ left: `${mostPoz}%` }}>
                {MOST}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="racs racs--2-1">
        {/* ---- Lezárásra váró munkalapok ---- */}
        <section className="kartya" aria-labelledby="lezaras-cim">
          <div className="kartya__fej">
            <h2 id="lezaras-cim">Lezárásra váró munkalapok</h2>
            <p>A szerelő beküldte, ellenőrzés után zárható</p>
          </div>
          <ul className="lista">
            {lezarasra.map((e) => {
              const gep = gepById(e.gep_id)
              const { ugyfel, telephely } = gepHelye(gep)
              const lap = munkalapByEsemeny(e.id)
              const szerelo = szereloById(e.hozzarendelt_szerelo_id)
              const lezarva = lezartak.includes(e.id)
              return (
                <li key={e.id} className="lista__elem">
                  <div className="lista__fo">
                    <Link to={`/gepek/${gep.uuid}`} className="cella__fo">
                      {gep.megnevezes}
                    </Link>
                    <span className="cella__al">
                      {tipusFelirat[e.tipus]} · {ugyfel.nev}, {telephely.nev}
                    </span>
                  </div>
                  <div className="munkalap-meta">
                    <span title="Szerelő">{szerelo?.nev}</span>
                    {lap && (
                      <>
                        <span className="munkalap-meta__adat" title="Munkaóra">
                          <Ikon nev="ora" meret={14} />
                          {szam(lap.munkaora)} ó
                        </span>
                        <span className="munkalap-meta__adat" title="Fotók">
                          <Ikon nev="foto" meret={14} />
                          {lap.foto_db}
                        </span>
                      </>
                    )}
                    <span className="halvany">{rovidDatum(e.tervezett_datum)}</span>
                  </div>
                  {lezarva ? (
                    <span className="lezarva">
                      <Ikon nev="pipa" />
                      Lezárva
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="gomb gomb--masodlagos gomb--kicsi"
                      onClick={() => setLezartak([...lezartak, e.id])}
                    >
                      Lezárás
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        {/* ---- Esedékes karbantartások ---- */}
        <section className="kartya" aria-labelledby="esedekes-cim">
          <div className="kartya__fej">
            <h2 id="esedekes-cim">Esedékes karbantartások</h2>
          </div>
          <ul className="lista">
            {esedekes.slice(0, 4).map(({ gep, e }) => (
              <li key={gep.id}>
                <Link to={`/gepek/${gep.uuid}`} className="lista__elem esedekes-elem">
                  <div className="lista__fo">
                    <span className="esedekes-elem__sor">
                      <span className="cella__fo">{gep.megnevezes}</span>
                      <EsedekessegCimke e={e} />
                    </span>
                    <CiklusSav e={e} />
                    <span className="cella__al">{gepHelye(gep).ugyfel.nev}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="kartya__lab">
            <Link to="/esedekesseg" className="szoveges-link">
              Összes esedékesség
              <Ikon nev="jobbra" meret={14} />
            </Link>
          </div>
        </section>
      </div>

      <section className="kartya" aria-labelledby="kiosztas-cim">
        <div className="kartya__fej">
          <h2 id="kiosztas-cim">Kiosztásra váró munkák</h2>
          <Link to="/munkakiosztas" className="szoveges-link">
            Kiosztás
            <Ikon nev="jobbra" meret={14} />
          </Link>
        </div>
        <ul className="lista lista--negyes">
          {kiosztatlan.map((e) => {
            const gep = gepById(e.gep_id)
            const { ugyfel } = gepHelye(gep)
            return (
              <li key={e.id} className="lista__elem">
                <div className="lista__fo">
                  <span className="cella__fo">{gep.megnevezes}</span>
                  <span className="cella__al">
                    {rovidDatum(e.tervezett_datum)} · {ugyfel.nev}
                  </span>
                </div>
                <PrioritasCimke prioritas={e.prioritas} />
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

export default Dashboard
