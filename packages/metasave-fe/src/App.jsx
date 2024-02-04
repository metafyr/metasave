import './styles/App.css'
import './init.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import React from 'react'
import { useAuthContext } from './context/AuthContext.jsx'
import PleaseLogin from './pages/PleaseLogin.jsx'
import AlreadyLoggedIn from './pages/AlreadyLoggedIn.jsx'

function App() {
  const {loggedIn, web3auth, initWeb3Auth} = useAuthContext()
  React.useEffect(() => {
    initWeb3Auth()
  }, [])
  return (
    <>
      {web3auth && <BrowserRouter>
        <Routes>
          <Route path="/" element={!loggedIn ? <Login /> : <AlreadyLoggedIn />} />
          <Route path="/login" element={!loggedIn ? <Login /> : <AlreadyLoggedIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <PleaseLogin />} />
          <Route path="/dashboard/*" element={loggedIn ? <Dashboard /> : <PleaseLogin />} />
        </Routes>
      </BrowserRouter>}
    </>
  )
}

export default App
