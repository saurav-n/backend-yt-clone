import { useAuthStatus } from "@/app/auth";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function ProfileIcon({ isUserNameShown }: { isUserNameShown: boolean }) {
    const { data } = useAuthStatus()


    return (

        <div className={`w-full flex ${isUserNameShown ? 'justify-between' : 'justify-center'} items-center`}>
            {
                data.isLoggedIn ? (
                    <>
                        <div className="w-10 h-10 flex justify-center items-center border-[1px] border-gray-400 rounded-full">
                            <img src={`${data.user.avatar}`} alt="pp" className="w-full h-full rounded-full" />
                        </div>
                        <p className={`${isUserNameShown ? '' : 'hidden'} font-semibold text-sm`}>{data.user.fullName}</p>
                    </>
                ) : (
                    <>
                        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-gray-400">
                            <FaUser className="text-gray-900" />
                        </div>
                        <Link to={'/login-signup'} className={`text-blue-500 hover:underline ${!isUserNameShown ? 'hidden' : ''}`}>Login</Link>
                    </>
                )
            }
        </div>
    )
}