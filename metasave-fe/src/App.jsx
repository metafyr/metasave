import './styles/App.css'
import './init.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import React from 'react'
import { useAuthContext } from './context/AuthContext.jsx'

function App() {
  const {loggedIn, web3auth, initWeb3Auth} = useAuthContext()
  React.useEffect(() => {
    initWeb3Auth()
  }, [])
  return (
    <>
      {web3auth && <BrowserRouter>
        <Routes>
          <Route path="/" element={!loggedIn ? <Login /> : <Dashboard />} />
          <Route path="/login" element={!loggedIn ? <Login /> : <Dashboard />} />
          <Route path="/signup" element={!loggedIn ? <Signup /> : <Dashboard />} />
          <Route path="/register" element={!loggedIn ? <Signup /> : <Dashboard />} />
          <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Login />} />
          <Route path="/dashboard/*" element={loggedIn ? <Dashboard /> : <Login />} />
        </Routes>
      </BrowserRouter>}
    </>
  )
}

export default App
