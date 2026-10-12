import { Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Dashboard from './pages/Dashboard'
import GepLista from './pages/GepLista'
import GepAdat from './pages/GepAdat'
import Esedekesseg from './pages/Esedekesseg'
import Login from './pages/Login'
import Munkakiosztas from './pages/Munkakiosztas'
import NemTalalhato from './pages/NemTalalhato'
import Szervizesemenyek from './pages/Szervizesemenyek'
import Telephelyek from './pages/Telephelyek'
import Ugyfelek from './pages/Ugyfelek'
import './index.css'

export default function App(){
  return(
    <Routes>
      <Route path='/' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="gepek" element={<GepLista />} />
          <Route path="esedekesseg" element={<Esedekesseg />} />
          <Route path="munkakiosztas" element={<Munkakiosztas />} />
          <Route path="szervizesemenyek" element={<Szervizesemenyek />} />
          <Route path="telephelyek" element={<Telephelyek />} />
          <Route path="ugyfelek" element={<Ugyfelek />} />
      </Route>
          <Route path="gepek/:uuid" element={<GepAdat />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NemTalalhato />} />
    </Routes>
  )
}