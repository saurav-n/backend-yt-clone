import {createGlobalState} from ".";
import axios, { AxiosError } from 'axios'

type AuthData={
    isLoggedIn:boolean,
    user:{
        _id:string,
        email:string,
        fullName:string,
        userName:string,
        avatar:string
    }
}

type ErrorResponseType = {
    success: boolean,
    message: string
  }

const useAuthStatus=createGlobalState<AuthData>(()=>async ()=>{
    try {
            const response=await axios.get('http://localhost:3000/api/v1/users/getAuthStatus',{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('accessToken')}`,
                    'x-refresh-token':`Refresh ${localStorage.getItem('refreshToken')}`,
                },
            })
            return response?.data?.data
    } catch (error) {
        console.log(error)
    }
},['auth'])

export {useAuthStatus}