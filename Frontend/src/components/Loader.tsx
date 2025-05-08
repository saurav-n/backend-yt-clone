type LoaderProps={
    height:string,
    width:string,
    color:string
}
export default function Loader({height,width,color}:LoaderProps){
    return(
        <div 
        className={`h-${height} w-${width} rounded-[50%] border-2 border-orange-500 border-t-gray-500 animate-load `}
        >

        </div>
    )
}