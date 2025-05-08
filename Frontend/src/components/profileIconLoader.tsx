import { Skeleton } from "./ui/skeleton";

export default function ProfileIconLoader({ isUserNameShown = true }: { isUserNameShown: boolean }) {
    return (
        <div className={`w-full flex ${isUserNameShown ? 'justify-between' : 'justify-center'} items-center gap-x-1`}>
            <Skeleton className="w-11 h-11 rounded-full bg-orange-100" />
            <Skeleton className={`w-full h-2 bg-orange-100 ${isUserNameShown?'':'hidden'}`} />
        </div>
    )
}