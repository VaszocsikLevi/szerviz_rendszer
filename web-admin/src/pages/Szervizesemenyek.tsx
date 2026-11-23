import { useState } from 'react'
import { Link } from 'react-router-dom'
import OldalFejlec from '../components/OldalFejlec'
import Ikon from '../components/Ikon'
import Fiok from '../components/Fiok'
import { PrioritasCimke, StatuszLepcso } from '../components/Cimkek'
import { geptipusById, gepById, gepHelye, gepek, szereloById, szervizesemenyek } from '../data/mock'
import { prioritasFelirat, statuszFelirat, tipusFelirat } from '../data/cimkek'
import type { EsemenyStatusz, Prioritas } from '../data/tipusok'
import { datum, ido, rovidId } from '../utils/format'

type Szuro = 'MIND' | EsemenyStatusz

const szurok: Szuro[] = ['MIND', 'TERVEZETT', 'KIOSZTOTT', 'FOLYAMATBAN', 'KESZ', 'LEZART', 'TOROLT']

export default function Szervizesemenyek() {
  const [szuro, setSzuro] = useState<Szuro>('MIND')
  const [kereses, setKereses] = useState('')
  const [ujNyitva, setUjNyitva] = useState(false)

  const darab = (s: Szuro) =>
    s === 'MIND' ? szervizesemenyek.length : szervizesemenyek.filter((e) => e.statusz === s).length

  const kifejezes = kereses.trim().toLowerCase()
  const lista = szervizesemenyek
    .filter((e) => szuro === 'MIND' || e.statusz === szuro)
    .filter((e) => {
      if (!kifejezes) return true
      const gep = gepById(e.gep_id)
      const { ugyfel } = gepHelye(gep)
      return [gep.megnevezes, gep.sorozatszam, ugyfel.nev, e.uuid].some((m) => m.toLowerCase().includes(kifejezes))
    })
    .sort((a, b) => b.tervezett_datum.localeCompare(a.tervezett_datum))

  return (
    <div className="oldal">
      <OldalFejlec cim="Szervizesemények" alcim="Kiszállások és munkák a bejelentéstől a lezárásig">
        <button type="button" className="gomb gomb--fo" onClick={() => setUjNyitva(true)}>
          <Ikon nev="plusz" />
          Új szervizesemény
        </button>
      </OldalFejlec>

      <div className="eszkozsor">
        <div className="szegmens" role="group" aria-label="Szűrés státuszra">
          {szurok.map((s) => (
            <button key={s} type="button" aria-pressed={szuro === s} onClick={() => setSzuro(s)}>
              {s === 'MIND' ? 'Összes' : statuszFelirat[s]}
              <span className="szegmens__szam">{darab(s)}</span>
            </button>
          ))}
        </div>
        <label className="kereso">
          <span className="sr-only">Keresés</span>
          <Ikon nev="kereses" />
          <input
            className="input"
            type="search"
            placeholder="Gép, sorozatszám, ügyfél"
            value={kereses}
            onChange={(e) => setKereses(e.target.value)}
          />
        </label>
      </div>

      <div className="tabla-keret">
        <table className="tabla">
          <thead>
            <tr>
              <th className="csak-szeles">Azonosító</th>
              <th>Gép</th>
              <th>Ügyfél, telephely</th>
              <th>Szerelő</th>
              <th>Tervezett</th>
              <th>Státusz</th>
              <th className="szukit">
                <span className="sr-only">Művelet</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {lista.map((e) => {
              const gep = gepById(e.gep_id)
              const tipus = geptipusById(gep.geptipus_id)
              const { ugyfel, telephely } = gepHelye(gep)
              const szerelo = szereloById(e.hozzarendelt_szerelo_id)
              return (
                <tr key={e.id}>
                  <td className="szukit csak-szeles">
                    <span className="cimke">{rovidId(e.uuid)}</span>
                  </td>
                  <td className="csonkit">
                    <Link to={`/gepek/${gep.uuid}`} className="cella__fo" title={`${tipus.gyarto} ${tipus.tipusnev}`}>
                      {gep.megnevezes}
                    </Link>
                    <span className="cella__al esemeny-al" title={e.bejelentett_hiba ?? undefined}>
                      <span className="tipus">
                        <Ikon nev={e.tipus === 'HIBABEJELENTES' ? 'figyelem' : 'kulcs'} meret={14} />
                        {tipusFelirat[e.tipus]}
                      </span>
                      {(e.prioritas === 'MAGAS' || e.prioritas === 'SURGOS') && <PrioritasCimke prioritas={e.prioritas} />}
                    </span>
                  </td>
                  <td className="csonkit">
                    <span className="cella__fo">{ugyfel.nev}</span>
                    <span className="cella__al">{telephely.nev}</span>
                  </td>
                  <td>{szerelo ? szerelo.nev : <span className="halvany">Nincs kiosztva</span>}</td>
                  <td>
                    <span className="mono">{datum(e.tervezett_datum)}</span>
                    <span className="cella__al mono">{e.tervezett_idopont ? ido(e.tervezett_idopont) : 'Időpont nélkül'}</span>
                  </td>
                  <td>
                    <StatuszLepcso statusz={e.statusz} />
                  </td>
                  <td className="szukit">
                    {e.statusz === 'KESZ' && (
                      <button type="button" className="gomb gomb--masodlagos gomb--kicsi">
                        Lezárás
                      </button>
                    )}
                    {e.statusz === 'TERVEZETT' && (
                      <Link to="/munkakiosztas" className="gomb gomb--masodlagos gomb--kicsi">
                        Kiosztás
                      </Link>
                    )}
                  </td>
                </tr>
              )
            })}
            {lista.length === 0 && (
              <tr>
                <td colSpan={7} className="tabla__ures">
                  Nincs a szűrésnek megfelelő szervizesemény
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Fiok
        cim="Új szervizesemény"
        nyitva={ujNyitva}
        onBezar={() => setUjNyitva(false)}
        mentesFelirat="Esemény mentése"
        onMentes={() => setUjNyitva(false)}
      >
        <div className="mezo">
          <label htmlFor="uj-gep">Gép</label>
          <select id="uj-gep" className="select" defaultValue="">
            <option value="" disabled>
              Válassz gépet
            </option>
            {gepek.map((g) => (
              <option key={g.id} value={g.uuid}>
                {g.megnevezes} · {gepHelye(g).ugyfel.nev}
              </option>
            ))}
          </select>
        </div>
        <div className="urlap__sor">
          <div className="mezo">
            <label htmlFor="uj-tipus">Típus</label>
            <select id="uj-tipus" className="select" defaultValue="HIBABEJELENTES">
              {Object.entries(tipusFelirat).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="mezo">
            <label htmlFor="uj-prioritas">Prioritás</label>
            <select id="uj-prioritas" className="select" defaultValue={'NORMAL' satisfies Prioritas}>
              {Object.entries(prioritasFelirat).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="urlap__sor">
          <div className="mezo">
            <label htmlFor="uj-datum">Tervezett nap</label>
            <input id="uj-datum" className="input" type="date" />
          </div>
          <div className="mezo">
            <label htmlFor="uj-ido">Időpont</label>
            <input id="uj-ido" className="input" type="time" />
          </div>
        </div>
        <div className="mezo">
          <label htmlFor="uj-hiba">Bejelentett hiba</label>
          <textarea id="uj-hiba" className="textarea" placeholder="Mit tapasztalt az ügyfél" />
          <span className="mezo__sugo">Karbantartásnál üresen hagyható</span>
        </div>
      </Fiok>
    </div>
  )
}
