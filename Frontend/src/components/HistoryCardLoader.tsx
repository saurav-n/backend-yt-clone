import { Skeleton } from "./ui/skeleton";

export default function HistoryCardLoader(){
    return(
        <div className="flex gap-x-2">
            <Skeleton className="w-[300px] aspect-video rounded-md"/>
            <div className="flex flex-col gap-y-1 w-full">
                <Skeleton className="h-6 rounded-2xl w-[30%]"/>
                <Skeleton className="h-6 rounded-2xl w-[20%]"/>
            </div>
        </div>
    )
}