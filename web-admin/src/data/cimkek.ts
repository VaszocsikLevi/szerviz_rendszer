// Az adatbázis enum értékeinek magyar felirata

import type { EsemenyStatusz, EsemenyTipus, Prioritas } from './tipusok'

export const statuszFelirat: Record<EsemenyStatusz, string> = {
  TERVEZETT: 'Tervezett',
  KIOSZTOTT: 'Kiosztott',
  FOLYAMATBAN: 'Folyamatban',
  KESZ: 'Kész',
  LEZART: 'Lezárt',
  TOROLT: 'Törölt',
}

/** Az állapotgép sorrendje – a státuszlépcső ebből rajzol */
export const statuszSorrend: EsemenyStatusz[] = ['TERVEZETT', 'KIOSZTOTT', 'FOLYAMATBAN', 'KESZ', 'LEZART']

export const prioritasFelirat: Record<Prioritas, string> = {
  ALACSONY: 'Alacsony',
  NORMAL: 'Normál',
  MAGAS: 'Magas',
  SURGOS: 'Sürgős',
}

export const tipusFelirat: Record<EsemenyTipus, string> = {
  TERVEZETT_KARBANTARTAS: 'Karbantartás',
  HIBABEJELENTES: 'Hibabejelentés',
}
