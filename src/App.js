import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Products from './pages/Products'
import SignInSide from './pages/Login'
import SignUp from './pages/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard/Dashboard'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/products" element={<Products />}></Route>
          <Route path="/" element={<SignInSide />}></Route>
          <Route path="/register" element={<SignUp />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
