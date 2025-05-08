import axios from "axios"

export default async function resetToken(){
    try {
        const tokenResetResponse = await axios.post('http://localhost:3000/api/v1/users/refreshAccessToken', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'x-refresh-token': `Refresh ${localStorage.getItem('refreshToken')}`,
          }
        })
        localStorage.removeItem('accessToken')
        localStorage.setItem('accessToken', tokenResetResponse.data.data.accessToken)
        alert('token reseted')
      } catch (err) {
        throw err
      }
}