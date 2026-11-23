import { useState } from 'react'
import OldalFejlec from '../components/OldalFejlec'
import Ikon from '../components/Ikon'
import Fiok from '../components/Fiok'
import { gepek, szervizesemenyek, telephelyek, ugyfelek } from '../data/mock'

// Darabszámok ügyfelenként – élesben ezt az API adja (COUNT + GROUP BY)
function ugyfelOsszesito(ugyfelId: number) {
  const sajatTelephelyek = telephelyek.filter((t) => t.ugyfel_id === ugyfelId).map((t) => t.id)
  const sajatGepek = gepek.filter((g) => sajatTelephelyek.includes(g.telephely_id)).map((g) => g.id)
  const nyitott = szervizesemenyek.filter(
    (e) => sajatGepek.includes(e.gep_id) && e.statusz !== 'LEZART' && e.statusz !== 'TOROLT',
  ).length
  return { telephely: sajatTelephelyek.length, gep: sajatGepek.length, nyitott }
}

export default function Ugyfelek() {
  const [kereses, setKereses] = useState('')
  const [ujNyitva, setUjNyitva] = useState(false)

  const kifejezes = kereses.trim().toLowerCase()
  const lista = ugyfelek.filter(
    (u) => !kifejezes || [u.nev, u.adoszam, u.kapcsolattarto_nev].some((m) => m.toLowerCase().includes(kifejezes)),
  )

  return (
    <div className="oldal">
      <OldalFejlec cim="Ügyfelek" alcim={`${ugyfelek.length} megrendelő cég`}>
        <button type="button" className="gomb gomb--fo" onClick={() => setUjNyitva(true)}>
          <Ikon nev="plusz" />
          Új ügyfél
        </button>
      </OldalFejlec>

      <div className="eszkozsor">
        <label className="kereso">
          <span className="sr-only">Keresés</span>
          <Ikon nev="kereses" />
          <input
            className="input"
            type="search"
            placeholder="Cégnév, adószám, kapcsolattartó"
            value={kereses}
            onChange={(e) => setKereses(e.target.value)}
          />
        </label>
      </div>

      <div className="tabla-keret">
        <table className="tabla">
          <thead>
            <tr>
              <th>Cég</th>
              <th>Kapcsolattartó</th>
              <th>Telefon</th>
              <th className="jobbra">Telephely</th>
              <th className="jobbra">Gép</th>
              <th className="jobbra">Nyitott munka</th>
              <th className="szukit">
                <span className="sr-only">Művelet</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {lista.map((u) => {
              const o = ugyfelOsszesito(u.id)
              return (
                <tr key={u.id}>
                  <td className="csonkit">
                    <span className="cella__fo">{u.nev}</span>
                    <span className="cella__al mono">{u.adoszam}</span>
                  </td>
                  <td className="csonkit">
                    <span className="cella__fo">{u.kapcsolattarto_nev}</span>
                    <span className="cella__al">{u.email}</span>
                  </td>
                  <td className="mono masodlagos">{u.telefon}</td>
                  <td className="jobbra mono">{o.telephely}</td>
                  <td className="jobbra mono">{o.gep}</td>
                  <td className="jobbra mono">{o.nyitott || <span className="halvany">0</span>}</td>
                  <td className="szukit">
                    <button type="button" className="gomb gomb--szoveg gomb--ikon" aria-label={`${u.nev} szerkesztése`}>
                      <Ikon nev="szerkeszt" />
                    </button>
                  </td>
                </tr>
              )
            })}
            {lista.length === 0 && (
              <tr>
                <td colSpan={7} className="tabla__ures">
                  Nincs találat
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Fiok
        cim="Új ügyfél"
        nyitva={ujNyitva}
        onBezar={() => setUjNyitva(false)}
        mentesFelirat="Ügyfél mentése"
        onMentes={() => setUjNyitva(false)}
      >
        <div className="mezo">
          <label htmlFor="ugyfel-nev">Cégnév</label>
          <input id="ugyfel-nev" className="input" required />
        </div>
        <div className="mezo">
          <label htmlFor="ugyfel-adoszam">Adószám</label>
          <input id="ugyfel-adoszam" className="input mono" placeholder="xxxxxxxx-y-zz" />
        </div>
        <div className="mezo">
          <label htmlFor="ugyfel-kapcsolat">Kapcsolattartó neve</label>
          <input id="ugyfel-kapcsolat" className="input" />
        </div>
        <div className="urlap__sor">
          <div className="mezo">
            <label htmlFor="ugyfel-email">E-mail</label>
            <input id="ugyfel-email" className="input" type="email" />
          </div>
          <div className="mezo">
            <label htmlFor="ugyfel-telefon">Telefon</label>
            <input id="ugyfel-telefon" className="input" type="tel" />
          </div>
        </div>
        <span className="mezo__sugo">Telephelyet és gépet a mentés után lehet hozzáadni</span>
      </Fiok>
    </div>
  )
}
