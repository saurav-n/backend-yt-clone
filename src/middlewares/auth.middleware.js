import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import ApiError from "../utils/ApiError.js";

const verifyToken=asyncHandler(async (req,res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ','')

        
        if(!token) throw new ApiError(401,'Unauthorized request')

        

        const decodedVal=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user=await User.findById(decodedVal?._id)?.select('-password -refreshToken')

        if(!user) throw new ApiError('401', 'Invalid token')

        req.user=user
        next()
    } catch (error) {
        throw error
    }
})

export {
    verifyToken
}