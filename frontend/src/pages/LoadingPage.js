import React from 'react'
import Loading from "../assets/img/loading_3.gif"


function LoadingPage() {
  return (
    <div className="h-[100vh] w-100vw flex justify-center items-center flex-col gap-6">
        <img src={Loading} alt="Loading GIF" className="w-28" />
        <p className="text-gray-600">It take few seconds. Please wait...</p>
    </div>
  )
}

export default LoadingPage
