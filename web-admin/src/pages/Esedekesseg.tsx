import { useState } from 'react'
import { Link } from 'react-router-dom'
import OldalFejlec from '../components/OldalFejlec'
import Ikon from '../components/Ikon'
import { CiklusSav, EsedekessegCimke } from '../components/Cimkek'
import { geptipusById, gepHelye, gepek, szervizesemenyek } from '../data/mock'
import { HAMAROSAN_NAP, legnagyobbArany, szamolEsedekesseg } from '../data/esedekesseg'
import type { EsedekessegAllapot } from '../data/esedekesseg'
import { datum, rovidDatum, szam } from '../utils/format'

type Szuro = 'mind' | EsedekessegAllapot

const szuroFelirat: Record<Szuro, string> = {
  mind: 'Összes',
  lejart: 'Lejárt',
  hamarosan: `${HAMAROSAN_NAP} napon belül`,
  rendben: 'Rendben',
}

// Nyitott (még nem lezárt) karbantartás a géphez – ilyenkor nem kell újat tervezni
function nyitottKarbantartas(gepId: number) {
  return szervizesemenyek.find(
    (e) =>
      e.gep_id === gepId &&
      e.tipus === 'TERVEZETT_KARBANTARTAS' &&
      e.statusz !== 'LEZART' &&
      e.statusz !== 'TOROLT',
  )
}

export default function Esedekesseg() {
  const [szuro, setSzuro] = useState<Szuro>('mind')

  const sorok = gepek
    .map((g) => ({ gep: g, e: szamolEsedekesseg(g) }))
    .sort((a, b) => legnagyobbArany(b.e) - legnagyobbArany(a.e))

  const darab = (s: Szuro) => (s === 'mind' ? sorok.length : sorok.filter((x) => x.e.allapot === s).length)
  const lista = sorok.filter((x) => szuro === 'mind' || x.e.allapot === szuro)

  return (
    <div className="oldal">
      <OldalFejlec
        cim="Karbantartási esedékesség"
        alcim="A géptípus ciklusa alapján. Ha napra és üzemórára is van ciklus, a korábban lejáró számít"
      />

      <div className="eszkozsor">
        <div className="szegmens" role="group" aria-label="Szűrés esedékességre">
          {(Object.keys(szuroFelirat) as Szuro[]).map((s) => (
            <button key={s} type="button" aria-pressed={szuro === s} onClick={() => setSzuro(s)}>
              {szuroFelirat[s]}
              <span className="szegmens__szam">{darab(s)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tabla-keret">
        <table className="tabla">
          <thead>
            <tr>
              <th>Gép</th>
              <th>Ügyfél, telephely</th>
              <th>Utolsó karbantartás</th>
              <th style={{ width: 240 }}>Esedékesség</th>
              <th className="szukit">
                <span className="sr-only">Művelet</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {lista.map(({ gep, e }) => {
              const tipus = geptipusById(gep.geptipus_id)
              const { ugyfel, telephely } = gepHelye(gep)
              const nyitott = nyitottKarbantartas(gep.id)
              const ciklus = [
                tipus.karbantartas_ciklus_nap && `${szam(tipus.karbantartas_ciklus_nap)} nap`,
                tipus.karbantartas_ciklus_uzemora && `${szam(tipus.karbantartas_ciklus_uzemora)} üzemóra`,
              ]
                .filter(Boolean)
                .join(' / ')
              return (
                <tr key={gep.id}>
                  <td className="csonkit">
                    <Link to={`/gepek/${gep.uuid}`} className="cella__fo">
                      {gep.megnevezes}
                    </Link>
                    <span className="cella__al">
                      {tipus.gyarto} {tipus.tipusnev}
                    </span>
                  </td>
                  <td className="csonkit">
                    <span className="cella__fo">{ugyfel.nev}</span>
                    <span className="cella__al">{telephely.nev}</span>
                  </td>
                  <td>
                    <span className="mono">{datum(gep.utolso_karbantartas_datum)}</span>
                    {gep.utolso_karbantartas_uzemora !== null && (
                      <span className="cella__al mono">{szam(gep.utolso_karbantartas_uzemora)} üzemóránál</span>
                    )}
                  </td>
                  <td>
                    <div className="esedekesseg-cella" title={`Ciklus: ${ciklus}`}>
                      <EsedekessegCimke e={e} />
                      <CiklusSav e={e} />
                    </div>
                  </td>
                  <td className="szukit">
                    {nyitott ? (
                      <span className="halvany">Nyitott munka: {rovidDatum(nyitott.tervezett_datum)}</span>
                    ) : (
                      e.allapot !== 'rendben' && (
                        <Link to="/szervizesemenyek" className="gomb gomb--masodlagos gomb--kicsi">
                          <Ikon nev="plusz" meret={14} />
                          Karbantartás tervezése
                        </Link>
                      )
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
