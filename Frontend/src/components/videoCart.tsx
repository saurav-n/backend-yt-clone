import { Video } from "@/app/videos";
import { LuDot } from "react-icons/lu";
import convertTimeStamp from "@/utils/TimeStampConvert";
import formatViews from "@/utils/ViewsFormatter";
import useGetChannel from "@/app/profile";
import convertMillisecondsToTimestamp from "@/utils/MilliSecToTimeStamp";
import axios from "axios";
import { useGetWatchHistory } from "@/app/videos";
import { useNavigate } from "react-router";

export default function VideoCart({video,url}:{video:Video,url:string}) {
    const navigate=useNavigate()
    const {data:ownerDetails}=useGetChannel(video.owner)
    const {refecthData:refetchWatchHistory}=useGetWatchHistory()


    return (
            <div className="w-full max-w-[300px] flex flex-col gap-y-2 cursor-pointer"
            onClick={()=>{
                console.log('onclick of div')
                const handleVideoWatch = async () => {
                    console.log('handled watch video')
                    await axios.post(`http://localhost:3000/api/v1/videos/watch?id=${video._id}`,{}, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                            'x-refresh-token': `Refresh ${localStorage.getItem('refreshToken')}`,
                        },
                    })
        
                    refetchWatchHistory()
                }
        
                handleVideoWatch()
                navigate(url)
            }}
            >
                <div className="w-full aspect-video rounded-md overflow-hidden bg-black relative z-[1]">
                    <img src={video.thumbnail}
                        alt="thumbnail"
                        className="w-full h-full object-fill" />
                    <span className="absolute bottom-1 right-1 rounded-md text-xs px-[2px] py-[1px] w-fit bg-[#00000099] text-white">
                        <p>{convertMillisecondsToTimestamp(video.duration)}</p>
                    </span>
                </div>
                <div className="flex flex-col gap-y-[2px]">
                    <div className="flex gap-x-2">
                        <div className="w-[15%] aspect-square rounded-full overflow-clip h-fit">
                            <img
                                className="w-full h-full"
                                src={ownerDetails.avatar}
                                alt="channel"
                            />
                        </div>
                        <p className="w-full text-base font-bold">
                            {video.description.length > 60 ? `${video.description.substring(0, 60)}...` : video.description}
                        </p>
                    </div>
                    <div className="w-full pl-[15%] text-gray-400 flex flex-col gap-y-[1px] text-sm">
                        <p>{ownerDetails.fullName}</p>
                        <span className="flex items-center">
                            <p>{`${formatViews(video.views)} views`}</p>
                            <LuDot />
                            <p>{convertTimeStamp(video.createdAt)}</p>
                        </span>
                    </div>
                </div>
            </div>
    )
}