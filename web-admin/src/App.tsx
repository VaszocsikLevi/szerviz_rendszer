import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Geplista from './pages/GepLista'
import GepAdat from './pages/GepAdat'

export default function App(){
  return(
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="gepek" element={<Geplista />} />
      <Route path="gepadat" element={<GepAdat />} />
    </Routes>
  )
}