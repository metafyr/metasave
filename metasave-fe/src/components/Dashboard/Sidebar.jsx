import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useParams } from 'react-router-dom';

const Sidebar = () => {
    const path = window.location.href.split("/")[4]
  return (
    <>
        <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
        </button>

        <aside id="default-sidebar" className="fixed top-18 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-[#E27396]">
                {/* ZK Logo */}
                
                <ul className="space-y-2 font-medium">
                    <li className='!my-10'>
                        <Link to='/dashboard' className={`pl-3 flex items-center p-2 rounded-[20px] group ${!path && 'bg-[#000] shadow-lg'} text-[#e7e7e7] text-xl hover:bg-[#000] hover:shadow-lg`}>
                            <AccountCircleIcon />
                            <span className="flex-1 ms-3 whitespace-nowrap">Dashboard</span>
                        </Link>
                    </li>
                    <li className='!my-10'>
                        <Link to='/dashboard/profile' className={`pl-3 flex items-center p-2 rounded-[20px] group ${path == 'profile' && 'bg-[#000] shadow-lg'} text-[#e7e7e7] text-xl hover:bg-[#000] hover:shadow-lg`}>
                            <AccountCircleIcon />
                            <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
                        </Link>
                    </li>
                    <li className='!my-10'>
                        <Link to='/login' className="pl-3 flex items-center p-2 rounded-[20px] group text-xl hover:bg-[#ff7878] text-[#e7e7e7] hover:shadow-lg">
                            <LogoutIcon />
                            <span className="flex-1 ms-3 whitespace-nowrap">Log out</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    </>
  )
}

export default Sidebar