import { IoIosLogOut } from "react-icons/io";
import { useAuthStatus } from "@/app/auth";
import { useErrorBoundary } from "react-error-boundary";
import axios from "axios";
import { useState } from "react";
import Loader from "./Loader";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";


type ErrorResponseType = {
  success: boolean,
  message: string
}

export default function LogoutButton({ isExpanded }: { isExpanded: boolean }) {
  const { showBoundary } = useErrorBoundary()
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)
  const { data, refecthData: refetchAuthData } = useAuthStatus()
  const navigate=useNavigate()
  const logoutHandler = async () => {
    setIsLoggingOut(true)
    try {
      const response = await axios.post('http://localhost:3000/api/v1/users/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'x-refresh-token': `Refresh ${localStorage.getItem('refreshToken')}`,
        },
      })
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      refetchAuthData()
      navigate('/')
    } catch (error) {
      showBoundary(error as AxiosError<ErrorResponseType>)
    }
    finally {
      setIsLoggingOut(false)
    }
  }
  return (
    <button className="w-full"
      onClick={() => {
        logoutHandler()
      }}
      disabled={!data.isLoggedIn || isLoggingOut}
    >
      <div className={`w-full ${data.isLoggedIn ? 'hover:bg-orange-200' : ''} hover:text-black rounded-md transition-all flex ${isExpanded ? '' : 'justify-center'} items-center relative group`}>
        <div className={`flex ${isExpanded ? 'gap-x-2' : 'justify-center'} rounded-md w-fit items-center px-1 py-2`}>
          <div className={`${isExpanded ? 'text-sm' : 'text-lg'}`}>
            {isLoggingOut ? (<Loader
              height={'5'}
              width={'5'}
              color="orange"
            />) : (<IoIosLogOut className={`${data.isLoggedIn ? '' : 'text-gray-400'}`} />)}
          </div>
          <p className={`${isLoggingOut?'text-sm':'text-lg'} ${isExpanded ? '' : 'hidden'} ${data.isLoggedIn ? '' : 'text-gray-400'}`}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </p>
        </div>
        {isExpanded ?
          (
            <></>
          ) : (
            <div className={`absolute bg-orange-200 left-[170%] p-1 rounded-md hidden ${data.isLoggedIn ? 'group-hover:block' : ''} shadow`}>
              <p >Logout</p>
            </div>
          )
        }
      </div>
    </button>
  )
}