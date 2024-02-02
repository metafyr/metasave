import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuthContext } from '../../context/AuthContext'

const RightSide = () => {
    const [email, setEmail] = React.useState('')
    const [password, setPass] = React.useState('')
    const [error, setError] = React.useState(false)
    const { login, web3auth } = useAuthContext()
    const handleLogin = async() => {
        try {
            const data = {
                email,
                password
            }
            const res = await axios.post('https://91ln5ijl3i.execute-api.eu-north-1.amazonaws.com/new/login', data)
            if(res.data.success){
                window.location.href = '/dashboard'
            }else{
                setError(true)
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='glass-effect rounded-tr-[15px] rounded-br-[15px] md:rounded-tl-[0px] md:rounded-bl-[0px] rounded-tl-[15px] rounded-bl-[15px] h-full w-full py-10 px-10'>
        <h1 className='text-center text-[#D01987] poppins font-medium text-2xl'>Login</h1>
        {/* {error && <p className='text-center text-red-600 my-5'>Wrong email or password. Please enter again</p>}
        <div className='my-10'>
            <div className='mb-5'>
                <label className='text-[#505050] poppins'>Email</label>
                <input
                onChange={(e) => setEmail(e.target.value)}
                type="text" 
                name="" 
                className='mt-3 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out' id="" />
            </div>
            <div className='mb-5'>
                <label className='text-[#505050] poppins'>Password</label>
                <input
                onChange={(e) => setPass(e.target.value)}
                type="password" 
                name="" 
                className='mt-3 bg-[#DEDEDE] rounded-[10px] pl-4 py-2 w-full focus:!outline-none text-[#A7A7A7] focus:!scale-105 transition duration-300 ease-in-out' id="" />
            </div>
            <p className='text-black poppins'>Do not have an account? <Link to='/signup' className='text-[#D01987]'>Sign up</Link></p>
        </div> */}
        <div className='flex flex-col justify-center items-center'>
        {/* <button
        onClick={handleLogin}
        className='bg-[#75ACFF] text-[#EFEFEF] text-center px-10 py-2 rounded-[10px] poppins hover:bg-[#5C8BFF] transition duration-300 ease-in-out'
        > 
            Login
        </button>
        <span className='text-center text-[#505050] poppins text-2xl my-5'>OR</span>
        <Link to='/signup'>
            <button
            className='bg-[#383838] text-[#EFEFEF] text-center px-10 py-2 rounded-[10px] poppins hover:bg-[#2A2A2A] transition duration-300 ease-in-out'
            > 
            Sign up
            </button>
        </Link> */}
        {web3auth && 
        <div className='my-10'>
            {/* <span className='text-center text-[#505050] poppins text-2xl my-5'>OR</span> */}
            <button
            onClick={login}
            className='bg-[#383838] text-[#EFEFEF] text-center px-10 py-2 rounded-[10px] poppins hover:bg-[#2A2A2A] transition duration-300 ease-in-out'
            > 
                Sign in with Google
            </button>
        </div>
        }
        </div>
    </div>
  )
}

export default RightSide