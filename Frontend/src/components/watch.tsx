import { useParams } from "react-router";
import VideoPage from "./VideoPage";
import { Suspense } from "react";
import VideoPageLoader from "./VideoPageLoader";

export default function WatchVideo() {
    const { videoId } = useParams()


    return (
        <Suspense fallback={<VideoPageLoader/>}>
            <VideoPage videoId={videoId}/>
        </Suspense>
    )
}