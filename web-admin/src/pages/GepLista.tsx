import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OldalFejlec from '../components/OldalFejlec'
import Ikon from '../components/Ikon'
import Fiok from '../components/Fiok'
import { EsedekessegCimke } from '../components/Cimkek'
import { geptipusById, geptipusok, gepHelye, gepek, telephelyek, ugyfelById, ugyfelek } from '../data/mock'
import { szamolEsedekesseg } from '../data/esedekesseg'
import { datum, szam } from '../utils/format'

const GepLista = () => {
  const navigate = useNavigate()
  const [kereses, setKereses] = useState('')
  const [ugyfelId, setUgyfelId] = useState('')
  const [ujNyitva, setUjNyitva] = useState(false)

  const kifejezes = kereses.trim().toLowerCase()
  const lista = gepek.filter((g) => {
    const { ugyfel, telephely } = gepHelye(g)
    const tipus = geptipusById(g.geptipus_id)
    if (ugyfelId && ugyfel.id !== Number(ugyfelId)) return false
    if (!kifejezes) return true
    return [g.megnevezes, g.sorozatszam, tipus.gyarto, tipus.tipusnev, telephely.nev].some((m) =>
      m.toLowerCase().includes(kifejezes),
    )
  })

  return (
    <div className="oldal">
      <OldalFejlec cim="Gépek" alcim={`${gepek.length} gép ${telephelyek.length} telephelyen`}>
        <button type="button" className="gomb gomb--fo" onClick={() => setUjNyitva(true)}>
          <Ikon nev="plusz" />
          Új gép
        </button>
      </OldalFejlec>

      <div className="eszkozsor">
        <div className="eszkozsor__bal">
          <label className="kereso">
            <span className="sr-only">Keresés</span>
            <Ikon nev="kereses" />
            <input
              className="input"
              type="search"
              placeholder="Megnevezés, sorozatszám, típus"
              value={kereses}
              onChange={(e) => setKereses(e.target.value)}
            />
          </label>
          <label className="sr-only" htmlFor="szuro-ugyfel">
            Ügyfél
          </label>
          <select id="szuro-ugyfel" className="select szuro-select" value={ugyfelId} onChange={(e) => setUgyfelId(e.target.value)}>
            <option value="">Minden ügyfél</option>
            {ugyfelek.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nev}
              </option>
            ))}
          </select>
        </div>
        <span className="halvany">{lista.length} találat</span>
      </div>

      <div className="tabla-keret">
        <table className="tabla">
          <thead>
            <tr>
              <th>Gép</th>
              <th>Sorozatszám</th>
              <th>Ügyfél, telephely</th>
              <th className="jobbra">Üzemóra</th>
              <th>Utolsó karbantartás</th>
              <th>Esedékesség</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((g) => {
              const tipus = geptipusById(g.geptipus_id)
              const { ugyfel, telephely } = gepHelye(g)
              return (
                <tr key={g.id} className="kattinthato" onClick={() => navigate(`/gepek/${g.uuid}`)}>
                  <td className="csonkit">
                    <Link to={`/gepek/${g.uuid}`} className="cella__fo" onClick={(e) => e.stopPropagation()}>
                      {g.megnevezes}
                    </Link>
                    <span className="cella__al">
                      {tipus.gyarto} {tipus.tipusnev}
                    </span>
                  </td>
                  <td>
                    <span className="cimke">{g.sorozatszam}</span>
                  </td>
                  <td className="csonkit">
                    <span className="cella__fo">{ugyfel.nev}</span>
                    <span className="cella__al">
                      {telephely.nev}, {telephely.varos}
                    </span>
                  </td>
                  <td className="jobbra mono">{g.uzemora !== null ? szam(g.uzemora) : <span className="halvany">–</span>}</td>
                  <td className="mono">{datum(g.utolso_karbantartas_datum)}</td>
                  <td>
                    <EsedekessegCimke e={szamolEsedekesseg(g)} />
                  </td>
                </tr>
              )
            })}
            {lista.length === 0 && (
              <tr>
                <td colSpan={6} className="tabla__ures">
                  Nincs találat
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Fiok
        cim="Új gép"
        nyitva={ujNyitva}
        onBezar={() => setUjNyitva(false)}
        mentesFelirat="Gép mentése"
        onMentes={() => setUjNyitva(false)}
      >
        <div className="mezo">
          <label htmlFor="gep-nev">Megnevezés</label>
          <input id="gep-nev" className="input" placeholder="Kompresszor 3 – présüzem" />
        </div>
        <div className="mezo">
          <label htmlFor="gep-tipus">Géptípus</label>
          <select id="gep-tipus" className="select" defaultValue="">
            <option value="" disabled>
              Válassz típust
            </option>
            {geptipusok.map((t) => (
              <option key={t.id} value={t.id}>
                {t.gyarto} {t.tipusnev}
              </option>
            ))}
          </select>
          <span className="mezo__sugo">A karbantartási ciklust a típus adja</span>
        </div>
        <div className="mezo">
          <label htmlFor="gep-telephely">Telephely</label>
          <select id="gep-telephely" className="select" defaultValue="">
            <option value="" disabled>
              Válassz telephelyet
            </option>
            {telephelyek.map((t) => (
              <option key={t.id} value={t.id}>
                {ugyfelById(t.ugyfel_id).nev} · {t.nev}
              </option>
            ))}
          </select>
        </div>
        <div className="mezo">
          <label htmlFor="gep-sorozatszam">Sorozatszám</label>
          <input id="gep-sorozatszam" className="input mono" />
        </div>
        <div className="urlap__sor">
          <div className="mezo">
            <label htmlFor="gep-telepites">Telepítés dátuma</label>
            <input id="gep-telepites" className="input" type="date" />
          </div>
          <div className="mezo">
            <label htmlFor="gep-uzemora">Üzemóra</label>
            <input id="gep-uzemora" className="input" type="number" min={0} />
          </div>
        </div>
      </Fiok>
    </div>
  )
}

export default GepLista
