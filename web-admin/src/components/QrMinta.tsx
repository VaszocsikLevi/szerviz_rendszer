// HELYŐRZŐ: QR-kódnak látszó minta a gép UUID-jából, NEM olvasható be.
// A valódi QR-hez egy QR generáló csomag kell (pl. `qrcode`), és a tartalom a gép UUID-ja.

const MERET = 25

const hash = (szoveg: string): number => {
  let h = 2166136261
  for (let i = 0; i < szoveg.length; i++) {
    h ^= szoveg.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** A három sarokjel helye */
const sarokjel = (x: number, y: number): boolean | null => {
  const sarkok = [
    [0, 0],
    [MERET - 7, 0],
    [0, MERET - 7],
  ]
  for (const [sx, sy] of sarkok) {
    const dx = x - sx
    const dy = y - sy
    if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) {
      if (dx === -1 || dy === -1 || dx === 7 || dy === 7) return false // fehér keret
      const kulso = dx === 0 || dy === 0 || dx === 6 || dy === 6
      const belso = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4
      return kulso || belso
    }
  }
  return null
}

const QrMinta = ({ uuid, meret = 96 }: { uuid: string; meret?: number }) => {
  let mag = hash(uuid)
  const negyzetek: { x: number; y: number }[] = []
  for (let y = 0; y < MERET; y++) {
    for (let x = 0; x < MERET; x++) {
      const s = sarokjel(x, y)
      if (s === null) {
        mag = Math.imul(mag ^ (mag >>> 15), 2246822507) >>> 0
        if (mag % 100 < 48) negyzetek.push({ x, y })
      } else if (s) {
        negyzetek.push({ x, y })
      }
    }
  }
  return (
    <svg width={meret} height={meret} viewBox={`-1 -1 ${MERET + 2} ${MERET + 2}`} className="qr" aria-label={`QR-kód: ${uuid}`} role="img">
      <rect x={-1} y={-1} width={MERET + 2} height={MERET + 2} fill="#fff" />
      {negyzetek.map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill="#16181b" />
      ))}
    </svg>
  )
}

export default QrMinta
