import { useGetWatchHistory, useVideo } from "@/app/videos";
import VideoPlayer from "./VideoPlayer";
import ProfileIconLoader from "./profileIconLoader";
import ChannelProfileIcon from "./ChannelProfile";
import { Suspense, useEffect } from "react";
import Comments from "./Comments";
import CommentsLoader from "./CommentsLoader";
import axios from "axios";

export default function VideoPage({ videoId }: { videoId?: string }) {
    const { data } = useVideo(videoId)

    const { refecthData: refetchWatchHistory } = useGetWatchHistory()


    useEffect(() => {
        const handleVideoWatch = async () => {
            await axios.post(`http://localhost:3000/api/v1/videos/watch?id=${videoId}`,{}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'x-refresh-token': `Refresh ${localStorage.getItem('refreshToken')}`,
                },
            })

            refetchWatchHistory()
        }

        handleVideoWatch()
    },[refetchWatchHistory])

    return (
        <div className="w-full h-full  flex gap-x-3 p-4">
            <div className="w-fit flex flex-col gap-y-1">
                <VideoPlayer videoFile={data?.videoFile} className="w-[1300px] bg-black" />
                <p className="text-xl font-bold">{data.description}</p>
                <Suspense fallback={<ProfileIconLoader isUserNameShown={true} />}>
                    <ChannelProfileIcon channelId={data.owner} />
                </Suspense>
            </div>
            <Suspense fallback={<CommentsLoader />}>
                <Comments videoId={videoId} />
            </Suspense>
        </div>
    )
}