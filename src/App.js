import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignInSide from './pages/Login'
import SignUp from './pages/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import Checkout from './pages/Checkout/Checkout'
import Reviews from './pages/Reviews'
import Lists from './pages/Lists'
import Product from './pages/Product'
import DashboardP from './pages/Dashboard/Products'

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
          <Route path="/dashboardP" element={<DashboardP />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
