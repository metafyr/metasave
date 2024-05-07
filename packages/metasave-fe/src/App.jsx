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
import CheckUser from './pages/CheckUser.jsx'
import NewIdentity from './pages/NewIdentity.jsx'
import ClinicLogin from './pages/clinic/ClinicLogin.jsx'
import ClinicRegister from './pages/clinic/ClinicRegister.jsx'
import CDash from './pages/clinic/CDash.jsx'

import ClinicDash from './pages/clinic/ClinicDash.jsx'
import ClinicProfile from './pages/clinic/ClinicProfile.jsx'
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
              element={loggedIn ? <Dashboard /> : <Login />}
            />
            <Route
              path="/dashboard/*"
              element={loggedIn ? <Dashboard /> : <Login />}
            />
            <Route
              path="/newclinic/"
              element={loggedIn ? <AddClinic /> : <Login />}
            />
            <Route
              path="/newdevice/"
              element={loggedIn ? <AddDevice /> : <Login />}
            />
            <Route
              path="/identity/"
              element={loggedIn ? <CheckUser /> : <Login />}
            />
            <Route
              path="/newidentity/"
              element={loggedIn ? <NewIdentity /> : <Login />}
            />

            <Route
              path="/clinic/*"
              element={loggedIn ? <CDash /> : <Login />}
            />
            <Route
              path="/clinic/dashboard"
              element={loggedIn ? <CDash /> : <Login />}
            />

            <Route
              path="/clinic/profile/"
              element={loggedIn ? <ClinicProfile /> : <Login />}
            />

            <Route
              path="/clinic/sigin/"
              element={loggedIn ? <ClinicLogin /> : <Login />}
            />

            <Route
              path="/clinic/signup/"
              element={loggedIn ? <ClinicRegister /> : <Login />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </>
  )
}

export default App
