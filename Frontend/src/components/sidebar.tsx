import { useRef, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import ProfileIcon from "./ProfileIcon";
import NavButton from "./NavButton";
import { CiHome } from "react-icons/ci";
import { GrLogin } from "react-icons/gr";
import { Suspense } from "react";
import ProfileIconLoader from "./profileIconLoader";
import LogoutButton from "./LogoutButton";
import { FaHistory } from "react-icons/fa";
import { RiVideoUploadLine } from "react-icons/ri";

export default function SideBar() {
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const barRef = useRef<HTMLDivElement>(null)
    return (
        <div className="w-14 h-[100vh] flex flex-col gap-y-3 px-2 py-3 bg-orange-50 items-center sticky top-0" ref={barRef}>
            <div className={`w-full flex ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                <p className={`text-lg font-bold ${!isExpanded ? 'hidden' : ''}`}>VideoTube</p>
                <button
                    onClick={() => {
                        if (isExpanded) barRef.current?.classList.replace('animate-expand', 'animate-squeeze')
                        else {
                            if (barRef.current?.classList.contains('animate-squeeze'))
                                barRef.current.classList.replace('animate-squeeze', 'animate-expand')
                            else barRef.current?.classList.add('animate-expand')
                        }
                        setIsExpanded(!isExpanded)
                    }}
                >
                    <RxHamburgerMenu className="font-bold" />
                </button>
            </div>
            <Suspense fallback={<ProfileIconLoader isUserNameShown={isExpanded} />}>
                <ProfileIcon isUserNameShown={isExpanded} />
            </Suspense>
            <div className="flex flex-col gap-y-3 px-1 w-full justify-center py-3 items-center">
                <NavButton
                    isExpanded={isExpanded}
                    label="Home"
                    icon={<CiHome/>}
                    to="/"
                />
                <NavButton
                    isExpanded={isExpanded}
                    label="Login/Signup"
                    icon={<GrLogin/>}
                    to="/login-signup"
                />
                <NavButton
                    isExpanded={isExpanded}
                    label="History"
                    icon={<FaHistory/>}
                    to="/history"
                />
                 <NavButton
                    isExpanded={isExpanded}
                    label="Upload Video"
                    icon={<RiVideoUploadLine/>}
                    to="/uploadVideo"
                />
                <Suspense fallback={<p>Loading...</p>}>
                    <LogoutButton isExpanded={isExpanded}/>
                </Suspense>
            </div>
        </div>
    )
}