import HistoryCardLoader from "./HistoryCardLoader";

export default function WatchHistoryLoader(){
    return(
        <div className="w-full flex flex-col gap-y-4">
            <HistoryCardLoader/>
            <HistoryCardLoader/>
            <HistoryCardLoader/>
            <HistoryCardLoader/>
            <HistoryCardLoader/>
        </div>
    )
}