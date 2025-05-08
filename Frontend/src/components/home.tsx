import { Suspense } from "react";
import Videos from "./Videos";
import VideosLoader from "./VideosLoader";
export default function Home() {
  return(
    <Suspense fallback={<VideosLoader/>}>
      <Videos/>
    </Suspense>
  )
}