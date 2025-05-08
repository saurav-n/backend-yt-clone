import { forwardRef, useState } from "react";
import { InputHTMLAttributes } from "react";

type VideoUploadInputProps={
    label:string,
    maxChars:number,
    typedChars:number
}&InputHTMLAttributes<HTMLInputElement>

const VideoUploadInput=forwardRef<HTMLInputElement,VideoUploadInputProps>(({label,maxChars,typedChars,...otherProps},ref)=>{
    
    return(
        <div className="flex flex-col gap-y-1">
            <div className="relative border-2 border-orange-400 rounded-md py-2 px-1">
                <div className="p-1 absolute bottom-7 left-1 bg-slate-50 text-sm text-gray-400">
                    <p>{label}</p>
                </div>
                <input 
                type="text" 
                name="" 
                id="" 
                className="border-none outline-none bg-transparent"
                maxLength={maxChars}
                ref={ref}
                {...otherProps}
                />
            </div>
            <p className="text-base text-gray-400">{`${typedChars}/${maxChars}`}</p>
        </div>
    )
})

export default VideoUploadInput