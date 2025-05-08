import { Suspense } from "react";
import WatchHistory from "./WatchHistory";
import WatchHistoryLoader from "./watchHistoryLoader";

export default function WatchHistoryPage(){
    return (
        <Suspense fallback={<WatchHistoryLoader/>}>
            <WatchHistory/>
        </Suspense>
    )
}