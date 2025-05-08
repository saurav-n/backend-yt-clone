import CommentsLoader from "./CommentsLoader"
import ProfileIconLoader from "./profileIconLoader"
import { Skeleton } from "./ui/skeleton"

export default function VideoPageLoader(){
    return(
        <div className="w-full h-full  flex gap-x-3 p-4">
            <div className="w-fit flex flex-col gap-y-1">
                <Skeleton className="w-[1300px] aspect-video"/>
                <Skeleton className="w-24 h-4 rounded-lg"/>
                <div className="flex gap-x-2">
                    <Skeleton className="w-8 aspect-square rounded-full"/>
                    <Skeleton className=" w-20 h-4 rounded-lg"/>
                </div>
            </div>
            <div className="max-w-[250px]">
                <CommentsLoader/>
            </div>
        </div>
    )
}