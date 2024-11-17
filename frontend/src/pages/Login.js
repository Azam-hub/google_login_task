import React, { useEffect, useState } from 'react'
import GoogleLogo from "../assets/img/google-logo.png"
import Alert from "../components/Alert"
import LoadingPage from './LoadingPage';
import { Navigate } from 'react-router-dom';

function Login() {

  const baseUrl = process.env.REACT_APP_BACKEND_URL;
  console.log(baseUrl);

  const [loginUrl, setLoginUrl] = useState(null);
  const [error, setError] = useState({
    status: false,
    type: "",
    message: "",
  });

  const [authorized, setAuthorized] = useState(null)

  
  useEffect(() => {
    const fetchLoginUrl = async ()=>{
      let url = `${baseUrl}/api/auth/google`;
      let response = await fetch(url);
      let jsonData = await response.json()
      setLoginUrl(jsonData.url)
    }

    checkAuthorization()
    fetchLoginUrl()

  }, []);


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


  const formSubmit = (e)=>{
    e.preventDefault()
    setError({
      status: true,
      type: "danger",
      message: "Please Signin with Google. Currently login with email functionality is not available.",
    })
  }


  if (authorized === null || loginUrl === null) return <LoadingPage />; // Show loading while checking
  if (authorized === true) return <Navigate to="/" />;

  return (
    <div className="bg-gray-100 h-[100vh] w-[100vw] overflow-y-hidden">
      {error.status ? <Alert type={error.type} message={error.message} /> : ""}
      <div className="h-[100%] flex justify-center items-center">
        {/* <h1>login</h1> */}
        <div className="bg-white lg:w-[30vw] md:w-[70vw] sm:w-[90vw] w-[95%] border rounded-md p-5">
          <h3 className="text-xl font-medium">Login</h3>


          <form className="mt-5" onSubmit={formSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Email</label>
              <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your Email" required />
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Password</label>
              <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your Password" required />
            </div>
            {/* <div className="flex items-start mb-5">
              <div className="flex items-center h-5">
                <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
              </div>
              <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
            </div> */}
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
          </form>
          <div className="w-full relative my-3 before:content-[''] before:absolute before:top-[50%] before:translate-y-[-50%] before:left-0 before:w-[45%] before:h-0.5 before:bg-slate-600 after:content-[''] after:absolute after:top-[50%] after:translate-y-[-50%] after:right-0 after:w-[45%] after:h-0.5 after:bg-slate-600">
            <span className="w-fit mx-auto block">OR</span>
          </div>
          <div>
            {/* <a href='#' onClick={googleLogin} className="flex items-center justify-center gap-3 border border-gray-500 rounded-full py-3 hover:scale-[1.02] transition-all"><img src={GoogleLogo} className="w-7" alt="" />Sign in with Google</a> */}
            {loginUrl != null && (
              <a href={loginUrl} className="flex items-center justify-center gap-3 border border-gray-500 rounded-full py-3 hover:scale-[1.02] transition-all"><img src={GoogleLogo} className="w-7" alt="" />Sign in with Google</a>
                // <a href={loginUrl}>Google Sign In</a>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login