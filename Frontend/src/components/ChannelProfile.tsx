import useGetChannel from "@/app/profile"
import formatViews from "@/utils/ViewsFormatter"
import axios from "axios"
import { useState } from "react"
import { useErrorBoundary } from "react-error-boundary"
import Loader from "./Loader"

export default function ChannelProfileIcon({channelId}:{channelId:string}){
    const[isSubscribing,setIsSubscribing]=useState(false)
    const {data,refecthData}=useGetChannel(channelId)
    const {showBoundary}=useErrorBoundary()

    

    console.log(data)

    return(
        <div className="w-full flex justify-between">
            <div className="flex gap-x-1">
                <div className="rounded-full w-10 aspect-square overflow-clip">
                    <img className="w-full h-full" src={data.avatar} alt="" />
                </div>
                <div className="flex flex-col justify-between">
                    <p className="text-base font-bold">{data.userName}</p>
                    <p className="text-sm text-slate-500">{`${formatViews(data.subscribersCount)} subscribers`}</p>
                </div>
            </div>
            <button className={`${isSubscribing?'border-2 border-orange-500':`${!data.isSubscribed?'bg-orange-500 hover:bg-orange-700':'bg-gray-400'}`} rounded-3xl px-2 text-white transition-all`} 
            disabled={data.isSubscribed||isSubscribing}
            onClick={()=>{
                const handleSubscribeReq=async ()=>{
                    setIsSubscribing(true)
                    try {
                        const response=await axios.post(`http://localhost:3000/api/v1/users/subscribeTo?channelUserName=${data.userName}`,{},{
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                              'x-refresh-token': `Refresh ${localStorage.getItem('refreshToken')}`,
                            },
                          })
                        refecthData()
                    } catch (error) {
                        showBoundary(error as Error)
                    }finally{setIsSubscribing(false)}
                }
                handleSubscribeReq()
            }}
            >
                {isSubscribing?<Loader height="5" width="5" color="orange"/>:'Subscribe'}
            </button>
        </div>
    )
}