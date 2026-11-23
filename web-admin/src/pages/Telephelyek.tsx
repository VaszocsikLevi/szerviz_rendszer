import { useState } from 'react'
import OldalFejlec from '../components/OldalFejlec'
import Ikon from '../components/Ikon'
import Fiok from '../components/Fiok'
import { gepek, szervizesemenyek, telephelyek, ugyfelById, ugyfelek } from '../data/mock'

const Telephelyek = () => {
  const [ugyfelId, setUgyfelId] = useState('')
  const [ujNyitva, setUjNyitva] = useState(false)

  const lista = telephelyek.filter((t) => !ugyfelId || t.ugyfel_id === Number(ugyfelId))

  return (
    <div className="oldal">
      <OldalFejlec cim="Telephelyek" alcim="Ahol a gépek fizikailag állnak">
        <button type="button" className="gomb gomb--fo" onClick={() => setUjNyitva(true)}>
          <Ikon nev="plusz" />
          Új telephely
        </button>
      </OldalFejlec>

      <div className="eszkozsor">
        <div className="eszkozsor__bal">
          <label className="sr-only" htmlFor="tel-ugyfel">
            Ügyfél
          </label>
          <select id="tel-ugyfel" className="select szuro-select" value={ugyfelId} onChange={(e) => setUgyfelId(e.target.value)}>
            <option value="">Minden ügyfél</option>
            {ugyfelek.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nev}
              </option>
            ))}
          </select>
        </div>
        <span className="halvany">{lista.length} telephely</span>
      </div>

      <div className="tabla-keret">
        <table className="tabla">
          <thead>
            <tr>
              <th>Telephely</th>
              <th>Cím</th>
              <th className="jobbra">Gép</th>
              <th className="jobbra">Nyitott munka</th>
              <th>Megjegyzés a szerelőnek</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((t) => {
              const sajatGepek = gepek.filter((g) => g.telephely_id === t.id).map((g) => g.id)
              const nyitott = szervizesemenyek.filter(
                (e) => sajatGepek.includes(e.gep_id) && e.statusz !== 'LEZART' && e.statusz !== 'TOROLT',
              ).length
              return (
                <tr key={t.id}>
                  <td>
                    <span className="cella__fo">{t.nev}</span>
                    <span className="cella__al">{ugyfelById(t.ugyfel_id).nev}</span>
                  </td>
                  <td>
                    <span className="cella__fo telephely-cim">
                      <span className="mono">{t.iranyitoszam}</span> {t.varos}
                    </span>
                    <span className="cella__al">{t.cim}</span>
                  </td>
                  <td className="jobbra mono">{sajatGepek.length}</td>
                  <td className="jobbra mono">{nyitott || <span className="halvany">0</span>}</td>
                  <td className="masodlagos megjegyzes-cella tordelheto">{t.megjegyzes ?? <span className="halvany">–</span>}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Fiok
        cim="Új telephely"
        nyitva={ujNyitva}
        onBezar={() => setUjNyitva(false)}
        mentesFelirat="Telephely mentése"
        onMentes={() => setUjNyitva(false)}
      >
        <div className="mezo">
          <label htmlFor="tel-uj-ugyfel">Ügyfél</label>
          <select id="tel-uj-ugyfel" className="select" defaultValue="">
            <option value="" disabled>
              Válassz ügyfelet
            </option>
            {ugyfelek.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nev}
              </option>
            ))}
          </select>
        </div>
        <div className="mezo">
          <label htmlFor="tel-nev">Telephely neve</label>
          <input id="tel-nev" className="input" placeholder="Sóstói üzem" />
        </div>
        <div className="urlap__sor urlap__sor--irsz">
          <div className="mezo">
            <label htmlFor="tel-irsz">Irányítószám</label>
            <input id="tel-irsz" className="input mono" inputMode="numeric" maxLength={4} />
          </div>
          <div className="mezo">
            <label htmlFor="tel-varos">Város</label>
            <input id="tel-varos" className="input" />
          </div>
        </div>
        <div className="mezo">
          <label htmlFor="tel-cim">Utca, házszám</label>
          <input id="tel-cim" className="input" />
        </div>
        <div className="mezo">
          <label htmlFor="tel-megj">Megjegyzés a szerelőnek</label>
          <textarea id="tel-megj" className="textarea" placeholder="Bejárat, kulcs, térerő" />
        </div>
      </Fiok>
    </div>
  )
}

export default Telephelyek
