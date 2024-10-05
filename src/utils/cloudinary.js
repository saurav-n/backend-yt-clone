import { v2 as Cloudinary } from "cloudinary";
import fs from 'fs'

Cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_CLOUD_API_kEY,
    api_secret:process.env.CLOUDINARY_CLOUD_API_SECRET

})
const uploadOnCloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath) return null
        const response=await Cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        throw error
    }
}

export default uploadOnCloudinary
