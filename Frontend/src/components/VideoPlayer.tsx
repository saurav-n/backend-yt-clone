
export default function VideoPlayer({videoFile,className=''}:{videoFile:string,className:string}){
    return(
        <div className={`${className} aspect-video flex flex-col gap-y-2 rounded-xl overflow-hidden`}>
            <div className="w-full h-full">
                <video src={videoFile} controls className="w-full h-full"></video>
            </div>
        </div>
    )
}