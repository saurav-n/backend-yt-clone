import { ReactNode, useState,InputHTMLAttributes,forwardRef } from "react"

type InputProps={
    classname:string,
    type:string,
    placeholder:string,
    icon:ReactNode
}&InputHTMLAttributes<HTMLInputElement>

const Input=forwardRef<HTMLInputElement,InputProps>(({classname='',type='text',placeholder,icon,...otherProps},ref)=>{
    const [bgColor,setBgColor]=useState('bg-orange-50')
    const [isFocused,setIsFocused]=useState(false)
    const shouldBeShown=!classname.includes('hidden')
    classname.replace('hidden','')
    return(
        <div className={`flex items-center justify-center rounded-lg ${bgColor} border-2 ${isFocused?'border-slate-200':'border-orange-100'} p-1 ${!shouldBeShown?'hidden':''}`}>
            <div className={`w-[10%] max-w-[20px] flex justify-center py-1 h-full`}>
                {icon}
            </div>
            <input 
            className={`${classname} border-none outline-none p-1 bg-transparent`}
            type={type}
            placeholder={placeholder}
            onBlur={()=>{
                setBgColor('bg-orange-50')
                setIsFocused(false)
            }}
            onFocus={()=>{
                setBgColor('bg-transparent')
                setIsFocused(true)
            }}
            ref={ref}
            {...otherProps}
            />
        </div>
    )
})

export default Input