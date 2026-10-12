import { NavLink, Outlet } from "react-router-dom"

export default function Layout() {
    return(
        <div className="menu">
            <div className="sidebar">
                <header className="header">Szerviz rendszer</header>
                <nav className="nav">
                    <NavLink to="/" end>Dashboard</NavLink>
                    <NavLink to="/gepek" >Géplista</NavLink>
                    <NavLink to="/ugyfelek" >Ügyfelek</NavLink>
                    <NavLink to="/telephelyek" >Telephelyek</NavLink>
                    <NavLink to="/szervizesemenyek" >Szervizesemények</NavLink>
                    <NavLink to="/munkakiosztas" >Munkakiosztás</NavLink>
                    <NavLink to="/esedekesseg" >Esedékesség</NavLink>
                </nav>
            </div>
            <main className="main">
                <Outlet/>
            </main>
        </div>
    )
}