import type { ReactNode } from 'react'

interface OldalFejlecProps {
  cim: string
  alcim?: ReactNode
  /** Jobb oldali gombok */
  children?: ReactNode
}

const OldalFejlec = ({ cim, alcim, children }: OldalFejlecProps) => {
  return (
    <header className="oldalfejlec">
      <div>
        <h1>{cim}</h1>
        {alcim && <p className="oldalfejlec__alcim">{alcim}</p>}
      </div>
      {children && <div className="oldalfejlec__muveletek">{children}</div>}
    </header>
  )
}

export default OldalFejlec
