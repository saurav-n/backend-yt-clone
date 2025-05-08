import { Skeleton } from "./ui/skeleton"

export default function VideoLoader(){
    return(
        <div className="w-full max-w-[300px] flex flex-col gap-y-2">
            <Skeleton className="w-full aspect-video rounded-md"/>
            <div className="w-full flex justify-between">
                <Skeleton className="w-[15%] aspect-square rounded-full"/>
                <div className="w-full flex flex-col gap-y-[1px]">
                    <Skeleton className="w-full rounded-lg h-2"/>
                    <Skeleton className="w-[50%] rounded-lg h-2"/>
                </div>
            </div>
        </div>
    )
}