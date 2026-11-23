// Formázó segédfüggvények – egy helyen, hogy minden oldal ugyanúgy írja ki a dátumot, számot.

const datumFormat = new Intl.DateTimeFormat('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit' })
const rovidDatumFormat = new Intl.DateTimeFormat('hu-HU', { month: 'short', day: 'numeric' })
const hosszuDatumFormat = new Intl.DateTimeFormat('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
// useGrouping 'always': a 4 jegyű szám is tagolt legyen (4 000, nem 4000)
const szamFormat = new Intl.NumberFormat('hu-HU', { useGrouping: 'always' } as Intl.NumberFormatOptions)
const penzFormat = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 })

/** 2026.11.23. */
export function datum(iso: string | null | undefined): string {
  if (!iso) return '–'
  // "2026. 11. 23." -> "2026.11.23." – tömörebb a táblákban
  return datumFormat.format(new Date(iso)).replace(/\s/g, '')
}

/** nov. 23. */
export function rovidDatum(iso: string | null | undefined): string {
  if (!iso) return '–'
  return rovidDatumFormat.format(new Date(iso))
}

/** 2026. november 23., hétfő */
export function hosszuDatum(iso: string): string {
  return hosszuDatumFormat.format(new Date(iso))
}

/** 18 420 */
export function szam(n: number | null | undefined): string {
  if (n === null || n === undefined) return '–'
  return szamFormat.format(n)
}

/** 12 400 Ft */
export function penz(n: number): string {
  return penzFormat.format(n)
}

/** "08:30:00" -> "08:30" */
export function ido(t: string | null | undefined): string {
  if (!t) return '–'
  return t.slice(0, 5)
}

/** UUID első 8 karaktere nagybetűvel, a táblázatokban rövid azonosítónak */
export function rovidId(uuid: string): string {
  return uuid.slice(0, 8).toUpperCase()
}

/** Napok két ISO dátum között (b - a) */
export function napKulonbseg(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime()
  return Math.round(ms / 86_400_000)
}

/** ISO dátumhoz napokat ad */
export function napHozzaad(iso: string, nap: number): string {
  const d = new Date(iso)
  d.setDate(d.getDate() + nap)
  return d.toISOString().slice(0, 10)
}
