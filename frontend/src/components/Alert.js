import React from 'react'
import { BsExclamationCircle } from 'react-icons/bs'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'

function Alert({ type, message }) {
  return (
    <>
    <div className={`flex items-center px-4 py-3 mb-4 text-sm rounded-lg border 
      ${type == "success" ? 'text-green-800 bg-green-100 border-green-500 dark:bg-gray-800 dark:text-green-400' : 'text-red-800 bg-red-100 border-red-500 dark:bg-gray-800 dark:text-red-400'}`} role="alert">
        
      {type == "success" ? <IoIosCheckmarkCircleOutline className="text-[23px]" /> : <BsExclamationCircle className="text-xl" />}
      {/* <span className="sr-only">Info</span> */}
      <div className="ml-2 text-base">
        {message}
      </div>
    </div>
    </>
  )
}

export default Alert