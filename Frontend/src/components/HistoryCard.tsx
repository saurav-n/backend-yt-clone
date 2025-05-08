import { MdDeleteForever } from "react-icons/md"
import { useGetWatchHistory, Video } from "@/app/videos"
import convertMillisecondsToTimestamp from "@/utils/MilliSecToTimeStamp"
import useGetChannel from "@/app/profile"
import formatViews from "@/utils/ViewsFormatter"
import { Link } from "react-router-dom"
import axios from "axios"
import { useErrorBoundary } from "react-error-boundary"

export default function HistoryCard({ video }: { video: Video }) {
    const { data: videoOwnerDetails } = useGetChannel(video.owner)
    const { showBoundary } = useErrorBoundary()
    const { refecthData: refetchWatchHistory } = useGetWatchHistory()
    return (
        <div className="flex gap-x-2 z-0 relative">
            <Link to={`/watch/${video._id}`} className="w-fit">
                <div className="max-w-[300px] aspect-video rounded-md overflow-clip bg-black relative z-[1]">
                    <img src={video.thumbnail}
                        alt="thumbnail"
                        className="w-full h-full object-fill" />
                    <span className="absolute bottom-1 right-1 rounded-md text-xs px-[2px] py-[1px] w-fit bg-[#00000099] text-white">
                        <p>{convertMillisecondsToTimestamp(video.duration)}</p>
                    </span>
                </div>
            </Link>
            <div className="flex flex-col gap-y-1">
                <div className="flex justify-between w-[450px]">
                    <p className="text-lg font-bold">
                        {video.title}
                    </p>
                    <button
                        className="w-fit  p-1 rounded-full hover:bg-[#e9e8e8] transition-all self-start text-lg"
                        onClick={() => {
                            console.log('clicked')
                            const handleDelete = async () => {
                                try {
                                    const response = await axios.post(`http://localhost:3000/api/v1/users/deleteFromHistory?videoId=${video._id}`, {}, {
                                        headers: {
                                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                                            'x-refresh-token': `Refresh ${localStorage.getItem('refreshToken')}`,
                                        },
                                    })
                                    refetchWatchHistory()
                                } catch (error) {
                                    showBoundary(error)
                                }
                            }
                            handleDelete()
                        }}
                    >
                        <MdDeleteForever />
                    </button>
                </div>
                <span className="flex gap-x-1 text-slate-500 text-sm">
                    <p>
                        {videoOwnerDetails.fullName}
                    </p>
                    <p>
                        {formatViews(video.views)}
                    </p>
                </span>
                <div className="w-full">
                    <p className="text-slate-500 text-sm">
                        {video.description.length > 150 ? `${video.description.substring(0, 150)}....` : video.description}
                    </p>
                </div>
            </div>
        </div>
    )

}