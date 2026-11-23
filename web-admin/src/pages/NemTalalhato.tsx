import { Link } from 'react-router-dom'
import Ikon from '../components/Ikon'
import './Login.css'

export default function NemTalalhato() {
  return (
    <div className="content">
      <div className="nemtalalhato">
        <span className="nemtalalhato__kod">404</span>
        <h1>Ez az oldal nem létezik</h1>
        <p className="masodlagos">Lehet, hogy elírás van a címben, vagy a hivatkozott elemet törölték.</p>
        <Link to="/" className="gomb gomb--masodlagos">
          <Ikon nev="vissza" />
          Vissza az áttekintéshez
        </Link>
      </div>
    </div>
  )
}
