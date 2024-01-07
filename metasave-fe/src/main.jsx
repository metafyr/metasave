import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import './styles/fonts.css'
import { MainContextProvider } from './context/MainContext.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { SignupProvider } from './pages/Signup.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainContextProvider>
      <AuthContextProvider>
        <SignupProvider>
          <App />
        </SignupProvider>
      </AuthContextProvider>
    </MainContextProvider>
  </React.StrictMode>,
)
