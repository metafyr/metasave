import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NewIdentity = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
    }
  }
  return (
    <div>
      <div className="min-h-screen font-sans flex">
        <div className="w-1/3 bg-black flex flex-col px-12 justify-center">
          <h2 className="text-white text-3xl font-bold">Welcome to</h2>
          <h1 className="text-white text-7xl font-extrabold">MetaSave</h1>
          <p className="text-white text-sm mt-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non
            velit mattis, lacinia tellus consectetur, pulvinar elit. Sed finibus
            a lacus vitae congue.{' '}
          </p>
        </div>
        <div className="w-2/3 flex items-center justify-center">
          <div className="max-w-md w-1/2 space-y-8">
            <div className="flex items-center mt-4">
              <span className="text-xl font-bold">MetaSave</span>
            </div>
            <div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Sign in to your account
              </h2>

              <div className="mt-4 text-center text-white">
                <Link to="/signup">
                  <div className="mt-6 bg-[#2A9D8F] w-1/2 py-2 rounded-lg">
                    Register as user
                  </div>
                </Link>
                <Link to="/clinic/signup/">
                  <div className="mt-6 bg-[#4A9DFF] w-1/2 py-2 rounded-lg">
                    Register as clinic
                  </div>
                </Link>
              </div>
              <p className="mt-4 text-sm">
                Already User?&nbsp;
                <a href="/identity" className="font-medium underline">
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewIdentity
