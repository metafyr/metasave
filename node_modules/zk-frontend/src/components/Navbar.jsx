import React from 'react'

const Navbar = () => {
  return (
    <nav className="gradient-changing-bg">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap gradient-changing-text poppins poppins">ZK Medicals</span>
            </a>
            {/* <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
                <li>
                    <a href="#" className="block py-2 px-3 rounded gradient-changing-text poppins md:p-0" aria-current="page">Home</a>
                </li>
                <li>
                    <a href="#" className="block py-2 px-3 rounded gradient-changing-text poppins md:p-0">About</a>
                </li>
                <li>
                    <a href="#" className="block py-2 px-3 rounded gradient-changing-text poppins md:p-0">Services</a>
                </li>
                <li>
                    <a href="#" className="block py-2 px-3 rounded gradient-changing-text poppins md:p-0">Pricing</a>
                </li>
                <li>
                    <a href="#" className="block py-2 px-3 rounded gradient-changing-text poppins md:p-0">Contact</a>
                </li>
                </ul>
            </div> */}
        </div>
    </nav>
  )
}

export default Navbar