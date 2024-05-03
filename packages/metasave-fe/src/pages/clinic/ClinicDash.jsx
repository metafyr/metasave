import React, { useState } from 'react'
import NotificationAddOutlinedIcon from '@mui/icons-material/NotificationAddOutlined'
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined'
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined'
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined'
import TokenOutlinedIcon from '@mui/icons-material/TokenOutlined'
import Hex from '../../assets/hex.png'
import Bell from '../../assets/bell.png'
import Statistics from '../../assets/statistics.png'
import Stethescope from '../../assets/stethoscope.png'

const ClinicDash = () => {
  const [investmentAmount, setInvestmentAmount] = useState(1000)

  const handleSliderChange = (event) => {
    setInvestmentAmount(event.target.value)
  }

  return (
    <div className="px-5 py-4">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="poppins text-[#3a3a3a] text-3xl mb-3 md:mb-0">
            Dashboard
          </h1>
          <NotificationAddOutlinedIcon className="text-[#3a3a3a] text-3xl" />
        </div>
        <div className="my-10 grid grid-cols-2 md:grid-cols-2 gap-5">
          <div className="rounded-[15px] bg-[#B3DEE2] px-5 py-5 flex flex-col justify-between relative">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <h1 className="poppins text-2xl mb-3 md:mb-0 font-bold">
                Patient Details
              </h1>
            </div>
            <img
              src={Stethescope}
              alt="stethescope"
              className="ml-auto w-20 h-20"
            />
          </div>

          <div className="rounded-[15px] bg-[#B3DEE2] px-5 py-5 flex flex-col justify-between">
            <div className="relative flex flex-col mb-3 md:mb-20">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <h1 className="poppins text-2xl mb-3 md:mb-0 font-bold">
                  Create notification
                </h1>
              </div>
              <img
                src={Bell}
                alt="stethescope"
                className="absolute top-12 right-0 w-12 h-16"
              />
            </div>
          </div>
        </div>

        <div className="my-4 grid grid-cols-2 md:grid-cols-2 gap-5">
          <div className="rounded-[15px] bg-[#B3DEE2] px-5 py-5 flex flex-col justify-between">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <h1 className="poppins text-2xl mb-3 md:mb-0 font-bold">
                Statistics
              </h1>
            </div>
            <img
              src={Statistics}
              alt="stethescope"
              className="ml-auto w-20 h-20"
            />
          </div>
          <div className="relative rounded-[15px] bg-[#B3DEE2] px-5 py-5 flex flex-col justify-between">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <h1 className="poppins text-2xl font-bold">
                Recent Appointments
              </h1>
            </div>
            <img
              src={Hex}
              alt="stethescope"
              className="absolute top-16 right-4  w-16 h-16"
            />

            <div className="flex justify-between items-end mt-12"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClinicDash
