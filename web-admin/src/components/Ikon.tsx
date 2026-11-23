// Egyetlen ikonkészlet az egész felületre: 24-es rács, 1.5-ös vonal, a szöveg színét veszi át.
// Új ikon: tegyél be egy új kulcsot az `utvonalak` objektumba.

const utvonalak = {
  attekintes: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  munkalap: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3h6v1" />
      <path d="M9 10h6M9 14h6M9 18h3" />
    </>
  ),
  kiosztas: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M17 8h4M19 6v4" />
    </>
  ),
  naptar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M12 13.5v2.5l1.5 1.5" />
    </>
  ),
  gep: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
    </>
  ),
  ugyfel: (
    <>
      <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      <path d="M16 9h2a2 2 0 0 1 2 2v10" />
      <path d="M2 21h20M8 7h4M8 11h4M8 15h4" />
    </>
  ),
  telephely: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  kereses: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  plusz: <path d="M12 5v14M5 12h14" />,
  balra: <path d="M15 6l-6 6 6 6" />,
  jobbra: <path d="M9 6l6 6-6 6" />,
  vissza: <path d="M19 12H5M11 6l-6 6 6 6" />,
  kilepes: (
    <>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 8l-4 4 4 4M6 12h10" />
    </>
  ),
  figyelem: (
    <>
      <path d="M10.3 4.2L2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
      <path d="M12 9.5v4M12 17h.01" />
    </>
  ),
  pipa: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  ora: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  foto: (
    <>
      <path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  alkatresz: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </>
  ),
  alairas: (
    <>
      <path d="M3 18c2.5 0 3-4 5-4s1.5 3 3.5 3 2.5-2 4.5-2" />
      <path d="M3 21h18" />
      <path d="M15 4l5 5-6 6h-5v-5l6-6z" />
    </>
  ),
  qr: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3" />
    </>
  ),
  bezar: <path d="M6 6l12 12M18 6L6 18" />,
  kulcs: (
    <path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-2.5-2.5 1.5-1.5-1.5-1.5-1.5 1.5L7 15l6.3-6.3a4 4 0 0 0 1.4-2.4zM3 3l4 4" />
  ),
  felhasznalo: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </>
  ),
  szinkron: (
    <>
      <path d="M20 11a8 8 0 0 0-14.7-4.3L4 8" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14.7 4.3L20 16" />
      <path d="M20 20v-4h-4" />
    </>
  ),
  szerkeszt: (
    <>
      <path d="M4 20h4L19 9l-4-4L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
    </>
  ),
} as const

export type IkonNev = keyof typeof utvonalak

interface IkonProps {
  nev: IkonNev
  meret?: number
  className?: string
}

export default function Ikon({ nev, meret = 16, className }: IkonProps) {
  return (
    <svg
      className={className ? `ikon ${className}` : 'ikon'}
      width={meret}
      height={meret}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {utvonalak[nev]}
    </svg>
  )
}
