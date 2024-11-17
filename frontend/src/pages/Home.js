import "flowbite"
import React, { useEffect, useState } from 'react'
import { MdLink } from 'react-icons/md'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import LoadingPage from './LoadingPage';
import Loading from "../assets/img/loading_3.gif"
import { IoAlertCircle } from "react-icons/io5";
import Alert from "../components/Alert";
import { HiBars3 } from "react-icons/hi2";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Home() {

  const baseUrl = process.env.REACT_APP_BACKEND_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const query = useQuery();

  console.log(baseUrl);
  


  const [formData, setFormData] = useState({
    url: "",
    platform: "",
  })
  const [authorized, setAuthorized] = useState(null)
  const [dropdown, setDropdown] = useState(null)
  const [userData, setUserData] = useState(null)

  const [responseLoading, setResponseLoading] = useState(false)
  const [response, setResponse] = useState({
    status: null,
    score: "",
    colourClasses: ""
  })

  const [error, setError] = useState({
    status: false,
    type: "",
    message: "",
  });

  const [menuToggle, setMenuToggle] = useState(false)
  


  useEffect(() => {

    // Hit request at backend if redirected by google
    if (query.get('code') && query.get('scope') && query.get('authuser')) {
      let url = `${baseUrl}/api/auth/google/callback${location.search}`;

      fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        
        console.log(data);
        if (data.status) {

          setUserData(data.user);

          localStorage.setItem('token', data.token)
          setAuthorized(true)

          // To remove query params
          navigate(location.pathname, { replace: true });
        } else {
          navigate("/login")
        }

      });
    } else {
      checkAuthorization()
    }


  }, []);


  const formSubmit = async (e)=>{
    e.preventDefault();

    if (formData.url === "" || formData.platform === "") {
      setError({
        status: true,
        type: "danger",
        message: "Please fill all fields",
      })
      return
    } else {
      setError({
        status: false,
        type: "",
        message: "",
      })
    }

    setResponse({
      status: null,
      score : "",
      colourClasses: "",
    })

    const token = localStorage.getItem("token")
    setResponseLoading(true);

    let url = `${baseUrl}/api/checkScore?url=${formData.url}&platform=${formData.platform}`;
    let res = await fetch(url, {
      headers: {
        "authorization" : `Bearer ${token}`
      }
    })

    setResponseLoading(false)


    if (!res.ok) {
      setResponse({
        status: false,
        score: "",
        colourClasses: "",
      })
      return
    }

    let json = await res.json()    

    if (json.status) {
      const score = json.score;
      let colourClasses

      if (score >= 0.90) {
        colourClasses = 'border-green-600 bg-green-100'; // Green
      } else if (score >= 0.50) {
        colourClasses = 'border-yellow-600 bg-yellow-100'; // Yellow
      } else {
        colourClasses = 'border-red-600 bg-red-100'; // Red
      }

      

      setResponse({
        status: true,
        score,
        colourClasses
      })
    } else {
      setResponse({
        status: false,
        score: "",
        colourClasses: "",
      })
    }
    
  }


  const checkAuthorization = async () => {
    const token = localStorage.getItem("token")

    if (token) {
      let url = `${baseUrl}/api/checkLogin`;
      
      try{
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization" : `Bearer ${token}`
          }
        })

        const result = await response.json()
        if (result.status) {
          setUserData(result.user);
          setAuthorized(true)
        } else {
          setAuthorized(false)
        }
      } catch (error) {
        console.log(error);
        setAuthorized(false)
      }

    } else {
      setAuthorized(false)
    }
  }

  const logout = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")
    let url = `${baseUrl}/api/logout`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization" : `Bearer ${token}`
      }
    })

    const result = await response.json()
    if (result.status) {
      localStorage.removeItem("token")
      navigate("/login")
    } else {
      console.log(result);
    }      
  }

  
  if (authorized === null) return <LoadingPage />; // Show loading while checking
  if (authorized === false) return <Navigate to="login" />;
  

  return (
    <div>
      <header className="flex md:items-center items-start md:justify-evenly justify-between py-4 md:px-0 px-5 border-b-2 border-gray-300 shadow-lg relative z-10">
        <div className="flex gap-3 items-center ">
          <HiBars3 className="text-2xl md:hidden block" onClick={()=>setMenuToggle(!menuToggle)} />
          <h2 className="text-3xl font-bold">Logo</h2>
        </div>
        <div className={`md:flex gap-2 flex-col items-center md:flex-row  mt-14 md:mt-0 ${menuToggle ? "flex" : "hidden"}`}>
          <a href="#" className="hover:bg-black hover:text-white py-2 px-5 rounded-full transition-colors duration-200">Home</a>
          <a href="#" className="hover:bg-black hover:text-white py-2 px-5 rounded-full transition-colors duration-200">Services</a>
          <a href="#" className="hover:bg-black hover:text-white py-2 px-5 rounded-full transition-colors duration-200">Articles</a>
          <a href="#" className="hover:bg-black hover:text-white py-2 px-5 rounded-full transition-colors duration-200">Packages</a>
          <a href="#" className="hover:bg-black hover:text-white py-2 px-5 rounded-full transition-colors duration-200">Contact</a>
        </div>
        <div className="">
          <button id="dropdownUserAvatarButton" onClick={()=>setDropdown(!dropdown)} data-dropdown-toggle="dropdownAvatar" className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" type="button">
            <span className="sr-only">Open user menu</span>
            <img className="w-8 h-8 rounded-full" src={userData && userData.profile_pic} alt="user photo" />
          </button>

          {/* Dropdown menu */}
          <div id="dropdownAvatar" className={`z-10 ${dropdown ? "block" : "hidden"} absolute lg:-translate-x-16 -translate-x-[80%] translate-y-3 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}>
            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
              <div>{userData && userData.name}</div>
              <div className="font-medium truncate">{userData && userData.email}</div>
            </div>
            
            <div className="py-2">
              <a href="#" onClick={logout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
            </div>
          </div>
          

        </div>
      </header>
      <div className="  bg-gray-100 sm:px-10 px-4">
        {error.status ? <Alert type={error.type} message={error.message} /> : ""}
        
        <div className="py-10 mx-auto md:w-[60vw] w-[100%]">

          <h1 className="text-4xl font-bold text-center">Test Performance Score for your Website</h1>

          <form onSubmit={formSubmit} className="mt-20">
            <div className="flex md:gap-1 gap-4 md:flex-row flex-col">
              <div className="md:basis-[70%]">
                <label htmlFor="input-group-1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Web URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <MdLink />
                  </div>
                  <input type="text" id="input-group-1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter URL" onChange={(e)=>setFormData({...formData, url: e.target.value})} value={formData.url} />
                </div>
              </div>
              <div className=" md:basis-[30%]">
                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Platform</label>
                <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e)=>setFormData({...formData, platform: e.target.value})}>
                  <option value="">Choose a Platform</option>
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                </select>
              </div>
            </div>
            <button type="submit" className="bg-black text-white  py-2 px-5 rounded-full mt-4">Check Score</button>
          </form>

          {response.status &&
          <div className="w-full mt-5 p-9 bg-white rounded-md border border-gray-400 flex flex-col items-center gap-5">
            <p className="text-base">Performance score of <b>{formData.url}</b> for <b>{formData.platform}</b> is </p>
            <p className={`p-6 w-fit border-2 ${response.colourClasses} rounded-md text-xl font-bold`}>{response.score}</p>
          </div>
          }


          {response.status === false &&
          <div className="w-full mt-5 p-5 bg-red-100 rounded-md border border-gray-400 flex flex-col items-center gap-3">
            <p className="text-base"><IoAlertCircle className="text-red-700 text-5xl" /></p>
            <p className="w-fit text-base">Unable to fetch for <b>{formData.url}</b></p>
          </div>
          }


          {responseLoading && 
          <div className="w-full mt-5 p-9 bg-white rounded-md border border-gray-400 flex flex-col items-center gap-5">
            <img src={Loading} alt="Loading GIF" className="w-14" />
            <p className="text-center">Please wait. It may take around 30 to 40 seconds to fetch...</p>
          </div>
          }

        </div>

      </div>
    </div>
  )
}

export default Home