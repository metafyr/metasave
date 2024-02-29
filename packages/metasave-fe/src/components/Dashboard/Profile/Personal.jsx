import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DoneIcon from '@mui/icons-material/Done'
import { useMainContext } from '../../../context/MainContext'
import '../../../styles/Personal.css'

const Personal = () => {
  const { userDetails } = useMainContext()
  const [editMode, setEditMode] = React.useState({
    mode: '',
    edit: false,
  })

  return (
    <div className="my-10">
      <div className="pl-10 pr-5 py-5 bg-[#B3DEE2] rounded-[12px] flex flex-col">
        <div className="flex justify-between items-center">
          {editMode.edit && editMode.mode == 'name' ? (
            <input
              type="text"
              name=""
              className="text-[#3a3a3a] font-semibold poppins text-2xl my-5 bg-transparent focus:!outline-none border-b border-gray-400 border-b-2 pl-3"
              defaultValue={userDetails.name || 'Username'}
              id=""
            />
          ) : (
            <h1 className="text-[#3a3a3a] font-semibold poppins text-2xl my-5">
              {' '}
              {userDetails?.name || 'Username'}
            </h1>
          )}
          {editMode.edit && editMode.mode == 'name' ? (
            <div
              onClick={() => setEditMode({ edit: false })}
              className="flex items-center text-white bg-green-700 hover:bg-green-600 rounded-[10px] px-3 py-2 cursor-pointer"
            >
              <DoneIcon />
              <span className="ml-3 poppins font-semibold">Save</span>
            </div>
          ) : (
            <div
              onClick={() => setEditMode({ mode: 'name', edit: true })}
              className=" items-center text-[#4A9DFF] cursor-pointer md:flex hidden"
            >
              <EditIcon />
              <span className="ml-3 poppins font-semibold">Edit</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          {editMode.edit && editMode.mode == 'age' ? (
            <input
              type="text"
              name=""
              className="text-[#3a3a3a] font-medium min-w-[30%] poppins text-xl my-5 bg-transparent focus:!outline-none border-b border-gray-400 border-b-2 pl-3"
              defaultValue={userDetails.age || 'N/A'}
              id=""
            />
          ) : (
            <h4 className="text-[#3a3a3a] font-medium poppins text-xl my-5">
              <strong>Age: </strong> {userDetails?.age || 'N/A'}
            </h4>
          )}
          {editMode.edit && editMode.mode == 'age' ? (
            <div
              onClick={() => setEditMode({ edit: false })}
              className="flex items-center text-white bg-green-700 hover:bg-green-600 rounded-[10px] px-3 py-2 cursor-pointer"
            >
              <DoneIcon />
              <span className="ml-3 poppins font-semibold">Save</span>
            </div>
          ) : (
            <div
              onClick={() => setEditMode({ mode: 'age', edit: true })}
              className="flex items-center text-[#4A9DFF] cursor-pointer md:flex hidden"
            >
              <EditIcon />
              <span className="ml-3 poppins font-semibold">Edit</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          {editMode.edit && editMode.mode == 'phone' ? (
            <input
              type="text"
              name=""
              className="text-[#3a3a3a] font-medium min-w-[30%] poppins text-xl my-5 bg-transparent focus:!outline-none border-b border-gray-400 border-b-2 pl-3"
              defaultValue={userDetails.phone || 'N/A'}
              id=""
            />
          ) : (
            <h4 className="text-[#3a3a3a] font-medium poppins text-xl my-5">
              <strong>Mobile no: </strong> {userDetails?.phone || 'N/A'}
            </h4>
          )}
          {editMode.edit && editMode.mode == 'phone' ? (
            <div
              onClick={() => setEditMode({ edit: false })}
              className="flex items-center text-white bg-green-700 hover:bg-green-600 rounded-[10px] px-3 py-2 cursor-pointer"
            >
              <DoneIcon />
              <span className="ml-3 poppins font-semibold">Save</span>
            </div>
          ) : (
            <div
              onClick={() => setEditMode({ mode: 'phone', edit: true })}
              className="flex items-center text-[#4A9DFF] cursor-pointer md:flex hidden"
            >
              <EditIcon />
              <span className="ml-3 poppins font-semibold">Edit</span>
            </div>
          )}
        </div>
      </div>
      <div className="my-16">
        <h2 className="text-lg text-[#3a3a3a] font-semibold poppins">
          Additional Details
        </h2>
        <div className="mt-5 pl-10 pr-5 py-5 bg-[#B3DEE2] rounded-[12px] flex flex-col">
          <div className="my-3 flex justify-between">
            <h3 className="poppins font-semibold text-ld  text-[#3a3a3a]">
              Gender:
              {editMode.edit && editMode.mode == 'gender' ? (
                <select className="bg-transparent ml-5 font-medium poppins !outline-none">
                  <option value="male" selected>
                    Male
                  </option>
                  <option value="female">Female</option>
                </select>
              ) : (
                <span className="ml-5 font-medium">
                  {userDetails?.gender || 'N/A'}
                </span>
              )}
            </h3>
            {editMode.edit && editMode.mode == 'gender' ? (
              <div
                onClick={() => setEditMode({ edit: false })}
                className="flex items-center text-white bg-green-700 hover:bg-green-600 rounded-[10px] px-3 py-2 cursor-pointer"
              >
                <DoneIcon />
                <span className="ml-3 poppins font-semibold">Save</span>
              </div>
            ) : (
              <div
                onClick={() => setEditMode({ mode: 'gender', edit: true })}
                className="flex items-center text-[#4A9DFF] cursor-pointer md:flex hidden"
              >
                <EditIcon />
                <span className="ml-3 poppins font-semibold">Edit</span>
              </div>
            )}
          </div>
          <div className="my-3 flex justify-between items-center">
            <div>
              <h3 className="poppins font-semibold text-ld text-[#3a3a3a]">
                Address:
              </h3>
              {editMode.edit && editMode.mode == 'address' ? (
                <textarea className="mt-2 bg-transparent ml-5 font-medium poppins !outline-none h-full w-full">
                  {userDetails?.address || 'N/A'}
                </textarea>
              ) : (
                <p className="mt-2 font-medium poppins">
                  {userDetails?.address || 'N/A'}
                </p>
              )}
            </div>
            {editMode.edit && editMode.mode == 'address' ? (
              <div
                onClick={() => setEditMode({ edit: false })}
                className="flex items-center text-white bg-green-700 hover:bg-green-600 rounded-[10px] px-3 py-2 cursor-pointer"
              >
                <DoneIcon />
                <span className="ml-3 poppins font-semibold">Save</span>
              </div>
            ) : (
              <div
                onClick={() => setEditMode({ mode: 'address', edit: true })}
                className="flex items-center text-[#4A9DFF] cursor-pointer md:flex hidden"
              >
                <EditIcon />
                <span className="ml-3 poppins font-semibold">Edit</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Personal
