// Karbantartási esedékesség számítása – ugyanaz a logika, mint a v_gep_esedekesseg nézetben.
// Ha a típusnak napra ÉS üzemórára is van ciklusa, az számít, amelyik előbb lejár.

import type { Gep } from './tipusok'
import { MA, geptipusById } from './mock'
import { napHozzaad, napKulonbseg, szam } from '../utils/format'

export type EsedekessegAllapot = 'lejart' | 'hamarosan' | 'rendben'

export interface Esedekesseg {
  hatralevo_nap: number | null
  hatralevo_uzemora: number | null
  /** 0..1+ – a ciklus mekkora része telt el (napban) */
  nap_arany: number | null
  /** 0..1+ – a ciklus mekkora része telt el (üzemórában) */
  ora_arany: number | null
  /** A naptár szerinti következő esedékesség dátuma */
  kovetkezo_datum: string | null
  allapot: EsedekessegAllapot
  /** Melyik ciklus jár le előbb (arány alapján) */
  meghatarozo: 'nap' | 'uzemora' | null
}

/** Ennyi napon belül "hamarosan" esedékes */
export const HAMAROSAN_NAP = 30
/** Az üzemóra-ciklus ekkora része maradt hátra -> "hamarosan" */
export const HAMAROSAN_ORA_ARANY = 0.1

export const szamolEsedekesseg = (gep: Gep): Esedekesseg => {
  const tipus = geptipusById(gep.geptipus_id)

  let hatralevo_nap: number | null = null
  let nap_arany: number | null = null
  let kovetkezo_datum: string | null = null
  if (tipus.karbantartas_ciklus_nap && gep.utolso_karbantartas_datum) {
    kovetkezo_datum = napHozzaad(gep.utolso_karbantartas_datum, tipus.karbantartas_ciklus_nap)
    hatralevo_nap = napKulonbseg(MA, kovetkezo_datum)
    nap_arany = 1 - hatralevo_nap / tipus.karbantartas_ciklus_nap
  }

  let hatralevo_uzemora: number | null = null
  let ora_arany: number | null = null
  if (tipus.karbantartas_ciklus_uzemora && gep.utolso_karbantartas_uzemora !== null && gep.uzemora !== null) {
    hatralevo_uzemora = gep.utolso_karbantartas_uzemora + tipus.karbantartas_ciklus_uzemora - gep.uzemora
    ora_arany = 1 - hatralevo_uzemora / tipus.karbantartas_ciklus_uzemora
  }

  let allapot: EsedekessegAllapot = 'rendben'
  if ((hatralevo_nap !== null && hatralevo_nap <= 0) || (hatralevo_uzemora !== null && hatralevo_uzemora <= 0)) {
    allapot = 'lejart'
  } else if (
    (hatralevo_nap !== null && hatralevo_nap <= HAMAROSAN_NAP) ||
    (ora_arany !== null && ora_arany >= 1 - HAMAROSAN_ORA_ARANY)
  ) {
    allapot = 'hamarosan'
  }

  let meghatarozo: Esedekesseg['meghatarozo'] = null
  if (nap_arany !== null && ora_arany !== null) meghatarozo = ora_arany > nap_arany ? 'uzemora' : 'nap'
  else if (nap_arany !== null) meghatarozo = 'nap'
  else if (ora_arany !== null) meghatarozo = 'uzemora'

  return { hatralevo_nap, hatralevo_uzemora, nap_arany, ora_arany, kovetkezo_datum, allapot, meghatarozo }
}

/** "19 napja lejárt", "8 nap múlva", "190 üzemóra múlva" */
export const esedekessegSzoveg = (e: Esedekesseg): string => {
  if (e.meghatarozo === 'uzemora' && e.hatralevo_uzemora !== null) {
    const h = e.hatralevo_uzemora
    return h <= 0 ? `${szam(-h)} üzemórával túllépve` : `${szam(h)} üzemóra múlva`
  }
  if (e.hatralevo_nap === null) return 'Nincs ciklus'
  const n = e.hatralevo_nap
  if (n < 0) return `${szam(-n)} napja lejárt`
  if (n === 0) return 'Ma esedékes'
  return `${szam(n)} nap múlva`
}

/** A ciklus eltelt része, a kettő közül a nagyobb – a sávokhoz és a rendezéshez */
export const legnagyobbArany = (e: Esedekesseg): number => Math.max(e.nap_arany ?? 0, e.ora_arany ?? 0)
