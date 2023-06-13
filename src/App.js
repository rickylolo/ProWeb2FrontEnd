import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignInSide from './pages/Login'
import SignUp from './pages/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import Checkout from './pages/Checkout/Checkout'
import Perfil from './pages/Perfil'
import PerfilE from './pages/PerfilE'
import Reviews from './pages/Reviews'
import Lists from './pages/Lists'
import Product from './pages/Lists'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignInSide />}></Route>
          <Route path="/register" element={<SignUp />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/perfil" element={<Perfil />}></Route>
          <Route path="/perfile" element={<PerfilE />}></Route>
          <Route path="/reviews" element={<Reviews />}></Route>
          <Route path="/product" element={<Products />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
