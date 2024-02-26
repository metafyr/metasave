import './styles/App.css'
import './init.js'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom' // Import Navigate for redirection
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import React from 'react'
import { useAuthContext } from './context/AuthContext.jsx'
import PleaseLogin from './pages/PleaseLogin.jsx'
import AddClinic from './pages/AddClinic.jsx'
import AddDevice from './pages/AddDevice.jsx'

function App() {
  const { loggedIn, web3auth, initWeb3Auth } = useAuthContext()
  React.useEffect(() => {
    initWeb3Auth()
  }, [])
  return (
    <>
      {web3auth && (
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={loggedIn ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/login"
              element={loggedIn ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/register" element={<Signup />} />
            <Route
              path="/dashboard"
              element={loggedIn ? <Dashboard /> : <PleaseLogin />}
            />
            <Route
              path="/dashboard/*"
              element={loggedIn ? <Dashboard /> : <PleaseLogin />}
            />
            <Route
              path="/newclinic/"
              element={loggedIn ? <AddClinic /> : <PleaseLogin />}
            />
            <Route
              path="/newdevice/"
              element={loggedIn ? <AddDevice /> : <PleaseLogin />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </>
  )
}

export default App
