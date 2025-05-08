import { Video } from "@/app/videos";
import { LuDot } from "react-icons/lu";
import convertTimeStamp from "@/utils/TimeStampConvert";
import formatViews from "@/utils/ViewsFormatter";
import { Link } from "react-router-dom";
import useGetChannel from "@/app/profile";
import convertMillisecondsToTimestamp from "@/utils/MilliSecToTimeStamp";

export default function VideoCart({video,url}:{video:Video,url:string}) {
    const {data:ownerDetails}=useGetChannel(video.owner)


    return (
        <Link to={url}>
            <div className="w-full max-w-[300px] flex flex-col gap-y-2">
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
        </Link>
    )
}