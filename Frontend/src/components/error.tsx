import { FallbackProps } from "react-error-boundary";
import Container from "./container";
import { useNavigate } from "react-router";
import resetToken from "@/utils/TokenReset";
import { AxiosError } from "axios";


type ErrorResponseType = {
  success: boolean,
  message: string
}


export default function Error({ error, resetErrorBoundary }: FallbackProps) {
    const navigate = useNavigate()
    console.log(error.message)

    return (
        <Container>
            {
                (error as AxiosError<ErrorResponseType>).response?.data.message=== 'jwt expired' ? (
                    <div className="rounded-md bg-slate-100 shadow-md p-3">
                        <button 
                        onClick={() => {
                                const handleTokenExpiration=async ()=>{
                                    try {
                                        await resetToken()
                                        resetErrorBoundary()
                                        navigate('/')
                                    } catch (error) {
                                        console.log('error catched at error page')
                                        if((error as AxiosError<ErrorResponseType>).response?.data.message=== 'jwt expired'||(error as AxiosError<ErrorResponseType>).response?.data.message=== 'jwt malformed') 
                                            navigate('login-signup')
                                    }
                                }
                                handleTokenExpiration()
                            }
                        } 
                        className="bg-slate-400 rounded-md p-1">
                            Reset Token
                        </button>
                    </div>
                ) : (
                    <div className="rounded-md bg-slate-100 shadow-md p-3">
                        <button onClick={() => {
                            if((error as AxiosError<ErrorResponseType>).response?.data.message==='jwt malformed') navigate('login-signup')
                            resetErrorBoundary()
                        }

                            } className="bg-slate-400 rounded-md p-1">Try again</button>
                    </div>
                )
            }
        </Container>
    )
}