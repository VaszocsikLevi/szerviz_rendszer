// Jobbról becsúszó panel az új rekord űrlapokhoz (új ügyfél, új gép, új szervizesemény)

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import Ikon from './Ikon'

interface FiokProps {
  cim: string
  nyitva: boolean
  onBezar: () => void
  /** A mentés gomb felirata, pl. "Ügyfél mentése" */
  mentesFelirat: string
  onMentes: () => void
  children: ReactNode
}

export default function Fiok({ cim, nyitva, onBezar, mentesFelirat, onMentes, children }: FiokProps) {
  // Esc bezárja
  useEffect(() => {
    if (!nyitva) return
    const kezelo = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBezar()
    }
    window.addEventListener('keydown', kezelo)
    return () => window.removeEventListener('keydown', kezelo)
  }, [nyitva, onBezar])

  if (!nyitva) return null

  return (
    <>
      <div className="fiok-hatter" onClick={onBezar} />
      <form
        className="fiok"
        role="dialog"
        aria-modal="true"
        aria-label={cim}
        onSubmit={(e) => {
          e.preventDefault()
          onMentes()
        }}
      >
        <div className="fiok__fej">
          <h2>{cim}</h2>
          <button type="button" className="gomb gomb--szoveg gomb--ikon" onClick={onBezar} aria-label="Bezárás">
            <Ikon nev="bezar" />
          </button>
        </div>
        <div className="fiok__test urlap">{children}</div>
        <div className="fiok__lab">
          <button type="button" className="gomb gomb--masodlagos" onClick={onBezar}>
            Mégse
          </button>
          <button type="submit" className="gomb gomb--fo">
            {mentesFelirat}
          </button>
        </div>
      </form>
    </>
  )
}
