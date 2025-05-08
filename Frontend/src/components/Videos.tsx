import { useGetVideos } from "@/app/videos"
import VideoCart from "./videoCart"
import { useInView } from 'react-intersection-observer';
import VideoLoader from "./videoLoader";
import { useEffect } from "react";
import { useAuthStatus } from "@/app/auth";

export default function Videos(){
    const { data, hasNextPage, fetchNextPage } = useGetVideos()
    const [ref,inView]=useInView()
    const {data:authData}=useAuthStatus()
  
    console.log(data)
  
    useEffect(()=>{
      if(inView){
        fetchNextPage()
      }
    },[inView])
    return (
      <div className="w-full h-full flex flex-wrap gap-x-2 gap-y-4 p-2">
        {
          data.pages.map((page,index)=><>
            {
              page.data.videos.map((video)=><VideoCart key={video._id} video={video} url={authData.isLoggedIn?`/watch/${video._id}`:'/login-signup'}/>)
            }
          </>)
        }
  
        <div className={`w-full flex flex-wrap gap-x-2 gap-y-4 ${hasNextPage?'':'hidden'}`} ref={ref}>
          <VideoLoader/>
          <VideoLoader/>
          <VideoLoader/>
          <VideoLoader/>
          <VideoLoader/>
          <VideoLoader/>
        </div>
      </div>
    )
}