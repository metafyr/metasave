import React from 'react'
import LeftSide from '../components/Login/LeftSide'
import RightSide from '../components/Login/RightSide'

const Login = () => {
  return (
    <div className='bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pink-400 via-pink-200 to-sky-300 min-h-screen h-full'>
      <div className='md:px-16 px-8 py-16 w-full grid md:grid-cols-2 justify-center items-center gap-0'>

        {/* Left Side */}
        <LeftSide />
        {/* Left Side */}


        {/* Right Side  */}
        <RightSide />
        {/* Right Side  */}

      </div>
    </div>
  )
}

export default Login