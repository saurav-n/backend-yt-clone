import { FC, useState, useRef } from "react";
import Container from "./container";
import { FaRegUser } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import { CiUser } from "react-icons/ci";
import { MdOutlinePassword } from "react-icons/md";
import Input from "./input";
import ImageInput from "./fileInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuthStatus } from "@/app/auth";
import { useErrorBoundary } from "react-error-boundary";
import Loader from "./Loader";


const LoginSignup: FC = () => {
    const {refecthData:refecthAuthData}=useAuthStatus()
    const navigate=useNavigate()
    const {showBoundary}=useErrorBoundary()
    const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm()
    const [isLoginReq, setIsLoginReq] = useState(true)
    const [selectedProfilePics, setSelectedProfilePics] = useState<File[]>([])
    const [selectedCoverImgs,setSelectedCoverImgs]=useState<File[]>([])
    const borderRef = useRef<HTMLDivElement | null>(null)
    const formSubmitHandler:SubmitHandler<FieldValues>=isLoginReq?async (data)=>{
        try {
            const body={
                userName:data.username,
                password:data.password
            }

            const response=await axios.post('http://localhost:3000/api/v1/users/login',body)
            if(response?.status===200){
                localStorage.setItem('accessToken',response.data?.data?.accessToken)
                localStorage.setItem('refreshToken',response.data?.data?.refreshToken)
            }
            refecthAuthData()
            navigate('/')
        } catch (error) {
            showBoundary(error as Error)
        }
    }:async (data)=>{
        try {
            const formData=new FormData()
            formData.append('userName',data.username)
            formData.append('email',data.email)
            formData.append('fullName',data.fullname)
            formData.append('password',data.password)
            formData.append('avatar',selectedProfilePics[0])
            formData.append('coverImage',selectedCoverImgs?.[0])

            const response=await axios.post('http://localhost:3000/api/v1/users/register',formData)
            borderRef.current?.classList.replace('animate-moveRight', 'animate-moveLeft')
            setIsLoginReq(true)
        } catch (error) {
            showBoundary(error as Error)
        }
    }
    return (
        <Container>
            <form action="" className="w-full" onSubmit={handleSubmit(formSubmitHandler)}>
                <div className={`w-full flex flex-col md:flex-row gap-y-3 gap-x-5 justify-center items-center`}>
                    <div className="bg-slate-100 shadow rounded-md w-full max-w-[300px] h-fit">
                        <div className="w-full flex">
                            <div className="w-[50%] flex flex-col">
                                <button
                                    className={`w-full min-w-[50px] p-1 rounded-tl-md ${!isLoginReq ? 'hover:bg-slate-200' : ''} transition-all`}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (!isLoginReq) {
                                            borderRef.current?.classList.replace('animate-moveRight', 'animate-moveLeft')
                                        }
                                        setIsLoginReq(true)
                                    }}
                                >
                                    Login
                                </button>
                                <div className={`w-full h-[2px] bg-orange-500`} ref={borderRef}></div>
                            </div>
                            <button
                                className={`w-[50%] min-w-[50px] p-1  rounded-tr-md ${isLoginReq ? 'hover:bg-slate-200' : ''} transition-all`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (isLoginReq) {
                                        if (borderRef.current?.classList.contains('animate-moveLeft')) {
                                            borderRef.current.classList.replace('animate-moveLeft', 'animate-moveRight')
                                        }
                                        else {
                                            borderRef.current?.classList.add('animate-moveRight')
                                        }
                                    }
                                    setIsLoginReq(false)
                                }}
                            >
                                Signup
                            </button>
                        </div>
                        <div className="w-full flex flex-col gap-y-2 pt-4 pb-1 px-1">
                            <Input
                                classname={`w-full placeholder-gray-500`}
                                type="text"
                                placeholder="Username"
                                icon={<FaRegUser className="text-gray-500" />}
                                {...register('username',{
                                    required:'Username is required',
                                    pattern:{
                                        value:/^[a-z][a-z0-9_*./$%@#&!-()<>?]+$/,
                                        message:'Username should not contain uppercase letter and should start with lowercase letter'
                                    }
                                })}
                            />
                            {errors.username && <p className="text-red-500 text-sm">{typeof errors.username.message==='string'?errors.username.message:''}</p>}
                            <Input
                                classname={`w-full placeholder-gray-500 ${isLoginReq ? 'hidden' : ''}`}
                                type="text"
                                placeholder="Email"
                                icon={<TfiEmail className="text-gray-500" />}
                                {...register('email',{
                                    validate:(value)=>{
                                        if(!isLoginReq) {
                                            if(value==='') return 'Email is required'
                                            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)||'Invalid Email address'
                                        }
                                        return true
                                    },
                                })}
                            />
                            {errors.email &&  !isLoginReq &&
                            <p className="text-red-500 text-sm">{typeof errors.email.message==='string'?errors.email.message:''}</p>}
                            <Input
                                classname={`w-full placeholder-gray-500 ${isLoginReq ? 'hidden' : ''}`}
                                type="text"
                                placeholder="Full Name"
                                icon={<CiUser className="text-gray-500" />}
                                {...register('fullname',{
                                    validate:(value)=>{
                                        if(!isLoginReq) return value!==''||'Fullname is required'
                                        return true
                                    }
                                })}
                            />
                            {errors.fullname && !isLoginReq
                            && <p className="text-red-500 text-sm">{typeof errors.fullname.message==='string'?errors.fullname.message:''}</p>}
                            <Input
                                classname="w-full placeholder-gray-500"
                                type="password"
                                placeholder="Password"
                                icon={<MdOutlinePassword className="text-gray-500" />}
                                {...register('password',{
                                    required:'Password is required',
                                    pattern:{
                                        value:/^(?=.*)(?=.*\d).+$/,
                                        message:'Password must contain atleast one digit'
                                    },
                                    minLength:{
                                        value:8,
                                        message:'Password should be of length atleast 8'
                                    }
                                })}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{typeof errors.password.message==='string'?errors.password.message:''}</p>}
                            <button type="submit" className={`w-full ${isSubmitting?'bg-transparent border-2 border-orange-300': 'bg-orange-300' } rounded-md py-2 ${isSubmitting?'':'hover:bg-orange-400'} transition-all flex justify-center items-center`}>
                                {isSubmitting?(<Loader height="5" width="5" color="orange"/>):'Submit'}
                            </button>
                        </div>
                    </div>
                    <div className={`w-full max-w-[500px] h-full flex  gap-x-2 ${isLoginReq?'hidden':''} items-center justify-center`}>
                        <ImageInput
                            label="Profile Picture"
                            accept="image/*"
                            files={selectedProfilePics}
                            maxFiles={1}
                            setFiles={setSelectedProfilePics}
                            isRequired={true}
                            inputWidth={200}
                        />
                        <ImageInput
                            label="Cover Image"
                            accept="image/*"
                            files={selectedCoverImgs}
                            maxFiles={1}
                            setFiles={setSelectedCoverImgs}
                            inputWidth={200}
                        />
                    </div>
                </div>
            </form>
        </Container>
    )
}

export default LoginSignup