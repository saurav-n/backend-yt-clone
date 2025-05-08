import { Skeleton } from "./ui/skeleton";

export default function CommentLoader() {
    return (
        <div className="w-full flex gap-x-1">
            <Skeleton className="w-10 aspect-square rounded-full" />
            <div className="w-full flex flex-col gap-y-1">
                <Skeleton className="w-24 h-4 rounded-lg" />
                <Skeleton className="w-[12] h-4 rounded-lg" />
            </div>
        </div>
    )
}