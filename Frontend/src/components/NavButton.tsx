import { ReactNode} from "react"
import { NavLink } from "react-router-dom"
export default function NavButton({ isExpanded, icon, label, to }: { isExpanded: boolean, icon: ReactNode, label: string, to: string }) {
    return (
        <NavLink to={to} className={({isActive})=>`w-full ${isActive?'text-orange-500':''}`}>
            <div className={`w-full hover:bg-orange-200 hover:text-black rounded-md transition-all flex ${isExpanded?'':'justify-center'} items-center relative group z-0`}>
                <div className={`flex ${isExpanded ? 'gap-x-2' : 'justify-center'} rounded-md w-fit items-center px-1 py-2`}>
                    <div className={`${isExpanded?'text-sm':'text-lg'}`}>
                        {icon}
                    </div>
                    <p className={`text-lg ${isExpanded ? '' : 'hidden'}`}>{label}</p>
                </div>
                {isExpanded ?
                    (
                        <></>
                    ) : (
                        <div className={`absolute bg-orange-200 left-[170%] p-1 rounded-md hidden group-hover:block shadow z-[99999]`}>
                            <p>{label}</p>
                        </div>
                    )
                }
            </div>
        </NavLink>
    )
}