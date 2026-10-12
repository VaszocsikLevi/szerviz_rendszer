import { NavLink, Outlet } from "react-router-dom"

export default function Layout() {
    return(
        <div className="admin-layout">
            <header>Szerviz rendszer</header>
            <nav>
                <NavLink to="/" end>Dashboard</NavLink>
                <NavLink to="/esedekesseg" end>Esedekessegek</NavLink>
                <NavLink to="/gepek" end>Gepadat</NavLink>
                <NavLink to="/geplista" end>Geplista</NavLink>
                <NavLink to="/login" end>Login</NavLink>
                <NavLink to="/munkakiosztas" end>Munkakiosztas</NavLink>
                <NavLink to="*" end>Nemtalalhato</NavLink>
                <NavLink to="/szervizesemeny" end>Szervesemeny</NavLink>
                <NavLink to="/telephelyek" end>Telephelyek</NavLink>
                <NavLink to="/ugyfelek" end>Ugyfelek</NavLink>
            </nav>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}