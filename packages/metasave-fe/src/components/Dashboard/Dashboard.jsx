import React, { useState, useEffect } from 'react'
import axios from 'axios'
import dashImg from '../../assets/dashboardRight.svg'
import ImagePopup from './ImagePopup'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState('')
  const [fallData, setFallData] = useState({})
  const [selectedDate, setSelectedDate] = useState(Date)

  useEffect(() => {
    const fetchFallData = async () => {}
    fetchFallData()
  }, [])

  const openPopup = (imageSrc) => {
    setCurrentImage(imageSrc)
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
  }

  const getFallsForDate = (date) => {
    if (fallData[date]) {
      return [fallData[date]] // Return an array of falls for that date
    }
    return []
  }
  const fallsForSelectedDate = getFallsForDate(selectedDate)

  return (
    <div className="px-5 py-5">
      <div className="md:flex justify-between rounded-[15px] bg-[#FFEBFC] px-5 py-2">
        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-[#3a3a3a] text-4xl font-bold my-3 md:my-5">
            Appolo Hospital
          </h1>
          <h3 className="text-[#3a3a3a] text-xl md:text-3xl font-semibold my-3 md:my-5">
            Angamaly, Ernakulam
          </h3>
          <div className="w-1/2 md:w-1/2">
            <Link to="/newclinic">
              <button className="bg-[#AAF0D1] px-4 py-2 rounded-lg">
                Details
              </button>
            </Link>
          </div>
        </div>
        <img
          src={dashImg}
          alt="doctor image"
          className="md:w-1/3 hidden lg:block"
        />
      </div>
      <div className="my-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="poppins text-[#3a3a3a] text-3xl mb-3 md:mb-0 font-bold">
            Fall History
          </h1>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="poppins text-base md:text-2xl font-bold text-[#3a3a3a] focus:outline-none"
          />
        </div>

        <div className="my-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {fallsForSelectedDate.length > 0 ? (
            fallsForSelectedDate.map((fall, index) => (
              <div
                key={index}
                className="rounded-[15px] bg-[#FFEBFC] px-5 py-5 flex flex-col justify-between"
              >
                <div className="flex flex-col mb-3 md:mb-20">
                  <h3 className="text-[#3a3a3a] poppins font-semibold my-2 text-lg md:text-xl">
                    {fall.time}
                  </h3>
                  <h3 className="text-[#3a3a3a] poppins font-semibold my-2 text-lg md:text-xl">
                    Severe Fall
                  </h3>
                </div>
                <h3
                  className="ml-auto text-[#505050] md:text-xl text-base cursor-pointer"
                  onClick={() => openPopup(fall.url)}
                >
                  <u>VIEW IMAGE</u>
                </h3>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-lg text-[#3a3a3a] poppins">
              No falls happened on this date.
            </div>
          )}
        </div>
      </div>
      {isPopupOpen && (
        <ImagePopup
          src={currentImage}
          alt="Dashboard Image"
          onClose={closePopup}
        />
      )}
    </div>
  )
}

export default Dashboard
