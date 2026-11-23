// Kis, újrahasználható jelölések: státusz, prioritás, esedékesség, ciklussáv

import type { EsemenyStatusz, Prioritas } from '../data/tipusok'
import type { Esedekesseg } from '../data/esedekesseg'
import { esedekessegSzoveg, legnagyobbArany } from '../data/esedekesseg'
import { prioritasFelirat, statuszFelirat, statuszSorrend } from '../data/cimkek'

/**
 * A rendszer saját jele: az állapotgép öt lépése egy sávban.
 * TERVEZETT -> KIOSZTOTT -> FOLYAMATBAN -> KESZ -> LEZART
 */
export function StatuszLepcso({ statusz }: { statusz: EsemenyStatusz }) {
  const aktualis = statuszSorrend.indexOf(statusz)
  return (
    <span className={`lepcso lepcso--${statusz.toLowerCase()}`} title={statuszFelirat[statusz]}>
      <span className="lepcso__sav" aria-hidden="true">
        {statuszSorrend.map((s, i) => (
          <span key={s} className={i <= aktualis ? 'lepcso__fok lepcso__fok--kesz' : 'lepcso__fok'} />
        ))}
      </span>
      <span className="lepcso__felirat">{statuszFelirat[statusz]}</span>
    </span>
  )
}

export function PrioritasCimke({ prioritas }: { prioritas: Prioritas }) {
  return <span className={`prioritas prioritas--${prioritas.toLowerCase()}`}>{prioritasFelirat[prioritas]}</span>
}

export function EsedekessegCimke({ e }: { e: Esedekesseg }) {
  return (
    <span className={`esedekes esedekes--${e.allapot}`}>
      <span className="pont" aria-hidden="true" />
      {esedekessegSzoveg(e)}
    </span>
  )
}

/** Vékony sáv: a karbantartási ciklus mekkora része telt el */
export function CiklusSav({ e, arany }: { e: Esedekesseg; arany?: number | null }) {
  const a = arany ?? legnagyobbArany(e)
  const szazalek = Math.max(0, Math.min(1, a)) * 100
  return (
    <span className={`ciklus ciklus--${e.allapot}`} role="img" aria-label={`A ciklus ${Math.round(a * 100)}%-a telt el`}>
      <span className="ciklus__kitoltes" style={{ width: `${szazalek}%` }} />
    </span>
  )
}

export function Kezdobetuk({ nev }: { nev: string }) {
  const betuk = nev
    .split(' ')
    .map((r) => r[0])
    .slice(0, 2)
    .join('')
  return (
    <span className="kezdobetuk" aria-hidden="true">
      {betuk}
    </span>
  )
}
