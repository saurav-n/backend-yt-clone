import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
const registerUser = asyncHandler(async (req,res,next)=>{
    try {
        //extract data from request
        //validate data
        //check if the duplicate user exist or not
        //check avatar and cover images are stored perfectly
        //if stored store avatar and cover image in cloudinary
        //if avatar and cover image are stored perfectly in cloudinary then extract their urls
        //now create new user in mongo db using model
        //remove password and refreshToken fields and send the newly created user as response
        const {userName,email,password,fullName}=req.body

        if([userName,email,password,fullName].some(field=>field?.trim()==='')) throw new ApiError(400,'All fields are required')

        const duplicateUser=await User.findOne({
            $or:[
                {email},
                {userName}
            ]
        })

        if(duplicateUser) throw new ApiError(409,'User with same user name or email already exist')



        const avatarFilePath=req.files?.avatar?.[0]?.path
        const coverImageFilePath=req.files?.coverImage?.[0]?.path

        if(!avatarFilePath) throw new ApiError(400,'All fields are required')

        const avatarUrl=(await uploadOnCloudinary(avatarFilePath))?.url

        if(!avatarUrl) throw new ApiError(500,'Unable to upload avatar')

        let coverImageUrl=''

        if(coverImageFilePath){
            coverImageUrl=(await uploadOnCloudinary(coverImageFilePath))?.url
            if(!coverImageUrl && coverImageUrl!=='') throw new ApiError(500,'Unable to upload cover image')
        }

        const newUser=await User.create({
            userName,
            email,
            fullName,
            password,
            avatar:avatarUrl,
            coverImage:coverImageUrl
        })
        
        const userDataResponse=await User.findById(newUser._id).select('-password -refreshToken')

        if(!userDataResponse) throw new ApiError(500, 'Unable to create user')

        res.status(200).json(
            new ApiResponse(201,'User created successfully',userDataResponse)
        )
    } catch (error) {
        throw error
    }
})

export {registerUser}