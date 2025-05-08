import { Suspense } from "react";
import Container from "./container";
import HistoryCard from "./HistoryCard";
import { Video } from "@/app/videos";
import { useGetWatchHistory } from "@/app/videos";
import HistoryCardLoader from "./HistoryCardLoader";

export default function WatchHistory(){
    const {data}=useGetWatchHistory()
    const userHistory:Video[]=data.videos
    console.log(userHistory)
    return(
        <Container>
            <div className="w-full flex flex-col gap-y-4">
               {
                    userHistory.map(video=>(
                        <Suspense key={video._id} fallback={<HistoryCardLoader/>}>
                            <HistoryCard video={video}/>
                        </Suspense>
                    ))
               }
            </div>
        </Container>
    )
}