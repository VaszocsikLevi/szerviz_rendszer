import { useState } from 'react'
import { Link } from 'react-router-dom'
import OldalFejlec from '../components/OldalFejlec'
import Ikon from '../components/Ikon'
import { Kezdobetuk, PrioritasCimke, StatuszLepcso } from '../components/Cimkek'
import { MA, gepById, gepHelye, szerelok, szervizesemenyek } from '../data/mock'
import { tipusFelirat } from '../data/cimkek'
import type { Szervizesemeny } from '../data/tipusok'
import { hosszuDatum, ido, napHozzaad, rovidDatum, szam } from '../utils/format'
import './Munkakiosztas.css'

/** Egy szerelő napi munkaideje órában – a terhelés sávhoz */
const NAPI_KERET = 8

const prioritasSuly = { SURGOS: 0, MAGAS: 1, NORMAL: 2, ALACSONY: 3 }

export default function Munkakiosztas() {
  // Kiosztás az oldalon belül – élesben: PATCH /api/szervizesemenyek/{uuid} { hozzarendelt_szerelo_id }
  const [esemenyek, setEsemenyek] = useState<Szervizesemeny[]>(szervizesemenyek)
  const [valasztott, setValasztott] = useState<Record<number, string>>({})
  const [nap, setNap] = useState(MA)

  const kiosztatlan = esemenyek
    .filter((e) => e.statusz === 'TERVEZETT')
    .sort((a, b) => prioritasSuly[a.prioritas] - prioritasSuly[b.prioritas] || a.tervezett_datum.localeCompare(b.tervezett_datum))

  const napiMunkak = esemenyek.filter(
    (e) => e.tervezett_datum === nap && e.hozzarendelt_szerelo_id !== null && e.statusz !== 'TOROLT',
  )

  function kioszt(e: Szervizesemeny) {
    const szereloId = Number(valasztott[e.id])
    if (!szereloId) return
    setEsemenyek(
      esemenyek.map((x) =>
        x.id === e.id ? { ...x, hozzarendelt_szerelo_id: szereloId, statusz: 'KIOSZTOTT', tervezett_datum: nap } : x,
      ),
    )
  }

  return (
    <div className="oldal">
      <OldalFejlec cim="Munkakiosztás" alcim="A tervezett munkák szerelőhöz rendelése">
        <div className="napvalto">
          <button
            type="button"
            className="gomb gomb--masodlagos gomb--ikon"
            aria-label="Előző nap"
            onClick={() => setNap(napHozzaad(nap, -1))}
          >
            <Ikon nev="balra" />
          </button>
          <span className="napvalto__nap">{hosszuDatum(nap)}</span>
          <button
            type="button"
            className="gomb gomb--masodlagos gomb--ikon"
            aria-label="Következő nap"
            onClick={() => setNap(napHozzaad(nap, 1))}
          >
            <Ikon nev="jobbra" />
          </button>
          {nap !== MA && (
            <button type="button" className="gomb gomb--szoveg" onClick={() => setNap(MA)}>
              Ma
            </button>
          )}
        </div>
      </OldalFejlec>

      <div className="kiosztas">
        {/* ---- Bal oszlop: kiosztásra váró munkák ---- */}
        <section className="kiosztas__varo" aria-labelledby="varo-cim">
          <div className="kiosztas__oszlopfej">
            <h2 id="varo-cim">Kiosztásra vár</h2>
            <span className="mono halvany">{kiosztatlan.length}</span>
          </div>

          {kiosztatlan.length === 0 && <p className="kiosztas__ures">Minden munka ki van osztva</p>}

          {kiosztatlan.map((e) => {
            const gep = gepById(e.gep_id)
            const { ugyfel, telephely } = gepHelye(gep)
            return (
              <article key={e.id} className="munkakartya">
                <div className="munkakartya__fej">
                  <span className="tipus">
                    <Ikon nev={e.tipus === 'HIBABEJELENTES' ? 'figyelem' : 'kulcs'} meret={14} />
                    {tipusFelirat[e.tipus]}
                  </span>
                  <PrioritasCimke prioritas={e.prioritas} />
                </div>
                <div>
                  <Link to={`/gepek/${gep.uuid}`} className="cella__fo">
                    {gep.megnevezes}
                  </Link>
                  <span className="cella__al">
                    {ugyfel.nev}, {telephely.varos}
                  </span>
                </div>
                {e.bejelentett_hiba && <p className="munkakartya__hiba">{e.bejelentett_hiba}</p>}
                <div className="munkakartya__meta">
                  <span>Kért nap: {rovidDatum(e.tervezett_datum)}</span>
                  <span>Becsült {szam(e.becsult_ora)} óra</span>
                </div>
                <div className="munkakartya__kiosztas">
                  <label className="sr-only" htmlFor={`szerelo-${e.id}`}>
                    Szerelő
                  </label>
                  <select
                    id={`szerelo-${e.id}`}
                    className="select"
                    value={valasztott[e.id] ?? ''}
                    onChange={(ev) => setValasztott({ ...valasztott, [e.id]: ev.target.value })}
                  >
                    <option value="" disabled>
                      Válassz szerelőt
                    </option>
                    {szerelok.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nev}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="gomb gomb--fo" disabled={!valasztott[e.id]} onClick={() => kioszt(e)}>
                    Kiosztás
                  </button>
                </div>
              </article>
            )
          })}
        </section>

        {/* ---- Jobb oldal: szerelők napi munkái ---- */}
        <section className="kiosztas__szerelok" aria-label="Szerelők napi munkái">
          {szerelok.map((sz) => {
            const munkai = napiMunkak
              .filter((e) => e.hozzarendelt_szerelo_id === sz.id)
              .sort((a, b) => (a.tervezett_idopont ?? '99').localeCompare(b.tervezett_idopont ?? '99'))
            const ora = munkai.reduce((n, e) => n + e.becsult_ora, 0)
            const terheles = Math.min(1, ora / NAPI_KERET)
            const tul = ora > NAPI_KERET
            return (
              <div key={sz.id} className="szereloszlop">
                <div className="szereloszlop__fej">
                  <Kezdobetuk nev={sz.nev} />
                  <div className="szereloszlop__nev">
                    <span className="cella__fo">{sz.nev}</span>
                    <span className="cella__al">
                      {szam(ora)} / {NAPI_KERET} óra
                    </span>
                  </div>
                </div>
                <span className={tul ? 'terheles terheles--tul' : 'terheles'} aria-hidden="true">
                  <span style={{ width: `${terheles * 100}%` }} />
                </span>

                <ol className="szereloszlop__lista">
                  {munkai.map((e) => {
                    const gep = gepById(e.gep_id)
                    const { ugyfel } = gepHelye(gep)
                    return (
                      <li key={e.id} className="napimunka">
                        <span className="napimunka__ido mono">{e.tervezett_idopont ? ido(e.tervezett_idopont) : 'Nincs időpont'}</span>
                        <Link to={`/gepek/${gep.uuid}`} className="cella__fo">
                          {gep.megnevezes}
                        </Link>
                        <span className="cella__al">{ugyfel.nev}</span>
                        <StatuszLepcso statusz={e.statusz} />
                      </li>
                    )
                  })}
                  {munkai.length === 0 && <li className="szereloszlop__ures">Erre a napra nincs munkája</li>}
                </ol>
              </div>
            )
          })}
        </section>
      </div>
    </div>
  )
}
