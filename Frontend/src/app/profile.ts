import { createGlobalState } from "."
import axios from "axios"
const useGetChannel=createGlobalState((channelId)=>async ()=>{
    try {
        const response=await axios.get(`http://localhost:3000/api/v1/users/getUser?userId=${channelId}`,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'x-refresh-token': `Refresh ${localStorage.getItem('refreshToken')}`,
            },
          })
        return response.data.data
    } catch (error) {
        throw error
    }
},['channel'])

export default useGetChannel