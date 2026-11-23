import { Link, useParams } from 'react-router-dom'
import OldalFejlec from '../components/OldalFejlec'
import Ikon from '../components/Ikon'
import QrMinta from '../components/QrMinta'
import { CiklusSav, EsedekessegCimke, PrioritasCimke, StatuszLepcso } from '../components/Cimkek'
import {
  gepByUuid,
  gepHelye,
  geptipusById,
  munkalapByEsemeny,
  szereloById,
  szervizesemenyek,
} from '../data/mock'
import { szamolEsedekesseg } from '../data/esedekesseg'
import { tipusFelirat } from '../data/cimkek'
import { datum, ido, penz, rovidId, szam } from '../utils/format'
import './GepAdat.css'

const GepAdat = () => {
  const { uuid } = useParams()
  const gep = uuid ? gepByUuid(uuid) : undefined

  if (!gep) {
    return (
      <div className="oldal">
        <Link to="/gepek" className="visszalink">
          <Ikon nev="vissza" />
          Gépek
        </Link>
        <OldalFejlec cim="A gép nem található" alcim="Lehet, hogy törölték, vagy hibás a QR-kód" />
      </div>
    )
  }

  const tipus = geptipusById(gep.geptipus_id)
  const { ugyfel, telephely } = gepHelye(gep)
  const e = szamolEsedekesseg(gep)
  const elozmenyek = szervizesemenyek
    .filter((s) => s.gep_id === gep.id)
    .sort((a, b) => b.tervezett_datum.localeCompare(a.tervezett_datum))

  return (
    <div className="oldal">
      <div>
        <Link to="/gepek" className="visszalink">
          <Ikon nev="vissza" />
          Gépek
        </Link>
        <OldalFejlec
          cim={gep.megnevezes}
          alcim={
            <>
              {tipus.gyarto} {tipus.tipusnev} · {ugyfel.nev}, {telephely.nev}
            </>
          }
        >
          <button type="button" className="gomb gomb--masodlagos">
            <Ikon nev="qr" />
            QR-címke nyomtatása
          </button>
          <Link to="/szervizesemenyek" className="gomb gomb--fo">
            <Ikon nev="plusz" />
            Új szervizesemény
          </Link>
        </OldalFejlec>
      </div>

      <div className="gepadat">
        {/* ---- Adattábla: a gép "névtáblája" ---- */}
        <section className="adattabla" aria-label="Gép adatai">
          <span className="adattabla__szegecs" aria-hidden="true" />
          <span className="adattabla__szegecs" aria-hidden="true" />
          <span className="adattabla__szegecs" aria-hidden="true" />
          <span className="adattabla__szegecs" aria-hidden="true" />

          <div className="adattabla__fej">
            <div>
              <span className="adattabla__gyarto">{tipus.gyarto}</span>
              <span className="adattabla__tipus">{tipus.tipusnev}</span>
              <span className="adattabla__leiras">{tipus.leiras}</span>
            </div>
            <div className="adattabla__qr">
              <QrMinta uuid={gep.uuid} meret={104} />
              <span className="mono">{rovidId(gep.uuid)}</span>
            </div>
          </div>

          <dl className="adattabla__mezok">
            <div>
              <dt>Sorozatszám</dt>
              <dd className="mono">{gep.sorozatszam}</dd>
            </div>
            <div>
              <dt>Telepítve</dt>
              <dd className="mono">{datum(gep.telepites_datuma)}</dd>
            </div>
            <div>
              <dt>Üzemóra</dt>
              <dd className="mono">{gep.uzemora !== null ? `${szam(gep.uzemora)} h` : 'Nem mérik'}</dd>
            </div>
            <div>
              <dt>Ciklus</dt>
              <dd className="mono">
                {[
                  tipus.karbantartas_ciklus_nap && `${tipus.karbantartas_ciklus_nap} nap`,
                  tipus.karbantartas_ciklus_uzemora && `${szam(tipus.karbantartas_ciklus_uzemora)} h`,
                ]
                  .filter(Boolean)
                  .join(' / ')}
              </dd>
            </div>
          </dl>
        </section>

        {/* ---- Karbantartási ciklus ---- */}
        <section className="kartya ciklus-kartya" aria-labelledby="ciklus-cim">
          <div className="kartya__fej">
            <h2 id="ciklus-cim">Következő karbantartás</h2>
            <EsedekessegCimke e={e} />
          </div>
          <div className="kartya__test ciklus-kartya__test">
            {e.nap_arany !== null && (
              <div className="ciklus-sor">
                <div className="ciklus-sor__fej">
                  <span>Naptár szerint</span>
                  <span className="mono">{datum(e.kovetkezo_datum)}</span>
                </div>
                <CiklusSav e={e} arany={e.nap_arany} />
                <span className="ciklus-sor__al">
                  {e.hatralevo_nap! >= 0 ? `${szam(e.hatralevo_nap)} nap van hátra` : `${szam(-e.hatralevo_nap!)} napja lejárt`}
                </span>
              </div>
            )}
            {e.ora_arany !== null && (
              <div className="ciklus-sor">
                <div className="ciklus-sor__fej">
                  <span>Üzemóra szerint</span>
                  <span className="mono">
                    {szam(gep.utolso_karbantartas_uzemora! + tipus.karbantartas_ciklus_uzemora!)} h-nál
                  </span>
                </div>
                <CiklusSav e={e} arany={e.ora_arany} />
                <span className="ciklus-sor__al">
                  {e.hatralevo_uzemora! >= 0
                    ? `${szam(e.hatralevo_uzemora)} üzemóra van hátra`
                    : `${szam(-e.hatralevo_uzemora!)} üzemórával túllépve`}
                </span>
              </div>
            )}
            <p className="ciklus-kartya__utolso">
              Utolsó karbantartás: <span className="mono">{datum(gep.utolso_karbantartas_datum)}</span>
              {gep.utolso_karbantartas_uzemora !== null && (
                <span className="mono">, {szam(gep.utolso_karbantartas_uzemora)} h</span>
              )}
            </p>
          </div>
        </section>

        {/* ---- Telephely ---- */}
        <section className="kartya gepadat__telephely" aria-labelledby="telephely-cim">
          <div className="kartya__fej">
            <h2 id="telephely-cim">Telephely</h2>
          </div>
          <div className="kartya__test hely">
            <div>
              <span className="cella__fo">{telephely.nev}</span>
              <span className="cella__al">
                {telephely.iranyitoszam} {telephely.varos}, {telephely.cim}
              </span>
            </div>
            {telephely.megjegyzes ? (
              <p className="hely__megjegyzes">
                <Ikon nev="figyelem" meret={14} />
                {telephely.megjegyzes}
              </p>
            ) : (
              <span />
            )}
            <div className="hely__kapcsolat">
              <span className="cella__fo">{ugyfel.kapcsolattarto_nev}</span>
              <span className="cella__al">{ugyfel.nev}</span>
              <span className="cella__al mono">{ugyfel.telefon}</span>
              <span className="cella__al">{ugyfel.email}</span>
            </div>
          </div>
        </section>
      </div>

      {/* ---- Szervizelőzmények ---- */}
      <section aria-labelledby="elozmeny-cim" className="elozmenyek">
        <div className="elozmenyek__fej">
          <h2 id="elozmeny-cim">Szervizelőzmények</h2>
          <span className="mono halvany">{elozmenyek.length} esemény</span>
        </div>

        <ol className="idoszal">
          {elozmenyek.map((s) => {
            const lap = munkalapByEsemeny(s.id)
            const szerelo = szereloById(lap ? lap.keszitette_id : s.hozzarendelt_szerelo_id)
            const alkatreszOsszeg = lap?.alkatreszek.reduce((n, a) => n + a.mennyiseg * (a.egysegar_akkor ?? 0), 0) ?? 0
            return (
              <li key={s.id} className={`idoszal__elem idoszal__elem--${s.statusz.toLowerCase()}`}>
                <div className="idoszal__datum mono">
                  {datum(s.tervezett_datum)}
                  {s.tervezett_idopont && <span className="halvany">{ido(s.tervezett_idopont)}</span>}
                </div>
                <span className="idoszal__pont" aria-hidden="true" />
                <article className="esemeny">
                  <header className="esemeny__fej">
                    <span className="tipus">
                      <Ikon nev={s.tipus === 'HIBABEJELENTES' ? 'figyelem' : 'kulcs'} meret={14} />
                      {tipusFelirat[s.tipus]}
                    </span>
                    {(s.prioritas === 'MAGAS' || s.prioritas === 'SURGOS') && <PrioritasCimke prioritas={s.prioritas} />}
                    <StatuszLepcso statusz={s.statusz} />
                    <span className="cimke esemeny__id">{rovidId(s.uuid)}</span>
                  </header>

                  {s.bejelentett_hiba && (
                    <p className="esemeny__bejelentes">
                      <span className="halvany">Bejelentés: </span>
                      {s.bejelentett_hiba}
                    </p>
                  )}

                  {lap ? (
                    <>
                      <div className="esemeny__szoveg">
                        <p>{lap.elvegzett_munka}</p>
                        {lap.megallapitott_hiba && (
                          <p className="masodlagos">
                            <span className="halvany">Megállapított hiba: </span>
                            {lap.megallapitott_hiba}
                          </p>
                        )}
                      </div>

                      {lap.alkatreszek.length > 0 && (
                        <table className="alkatresz-tabla">
                          <tbody>
                            {lap.alkatreszek.map((a) => (
                              <tr key={a.megnevezes}>
                                <td>{a.megnevezes}</td>
                                <td className="mono halvany">{a.cikkszam}</td>
                                <td className="mono jobbra">
                                  {szam(a.mennyiseg)} {a.egyseg}
                                </td>
                                <td className="mono jobbra">
                                  {a.egysegar_akkor !== null ? penz(a.mennyiseg * a.egysegar_akkor) : '–'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={3}>Alkatrész összesen</td>
                              <td className="mono jobbra">{penz(alkatreszOsszeg)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      )}

                      <footer className="esemeny__lab">
                        <span>
                          <Ikon nev="felhasznalo" meret={14} />
                          {szerelo?.nev}
                        </span>
                        <span className="mono">
                          <Ikon nev="ora" meret={14} />
                          {ido(lap.kezdes_idopont.slice(11))}–{ido(lap.befejezes_idopont.slice(11))}, {szam(lap.munkaora)} ó
                        </span>
                        {lap.uzemora_allas !== null && (
                          <span className="mono">
                            <Ikon nev="gep" meret={14} />
                            {szam(lap.uzemora_allas)} h
                          </span>
                        )}
                        <span className="mono">
                          <Ikon nev="foto" meret={14} />
                          {lap.foto_db} fotó
                        </span>
                        <span>
                          <Ikon nev="alairas" meret={14} />
                          {lap.alairo_nev}
                        </span>
                        <span>
                          <Ikon nev="qr" meret={14} />
                          {lap.azonositas_modja === 'QR' ? 'QR-ral azonosítva' : 'Kézi azonosítás'}
                        </span>
                      </footer>
                    </>
                  ) : (
                    <footer className="esemeny__lab">
                      <span>
                        <Ikon nev="felhasznalo" meret={14} />
                        {szerelo ? szerelo.nev : 'Nincs kiosztva'}
                      </span>
                      <span className="halvany">Munkalap még nem érkezett</span>
                    </footer>
                  )}
                </article>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}

export default GepAdat
