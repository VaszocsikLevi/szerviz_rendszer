import { useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="content login">
      <div className="login__oszlop">
        <div className="marka marka--vilagos">
          <span className="marka__jel" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="marka__nev">Szerviz rendszer</span>
        </div>

        <form
          className="box urlap"
          onSubmit={(e) => {
            e.preventDefault()
            // Élesben: POST /api/auth/login, a tokent elmenteni, utána tovább
            navigate('/')
          }}
        >
          <div>
            <h1 className="login__cim">Bejelentkezés</h1>
            <p className="masodlagos">Diszpécser felület</p>
          </div>
          <div className="mezo">
            <label htmlFor="login-email">E-mail</label>
            <input id="login-email" className="input" type="email" autoComplete="username" required />
          </div>
          <div className="mezo">
            <label htmlFor="login-jelszo">Jelszó</label>
            <input id="login-jelszo" className="input" type="password" autoComplete="current-password" required />
          </div>
          <button type="submit" className="gomb gomb--fo gomb--teljes">
            Bejelentkezés
          </button>
        </form>

        <p className="login__megj">Szerelőként a mobilalkalmazásban jelentkezz be</p>
      </div>
    </div>
  )
}
