import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
const registerUser = asyncHandler(async (req, res, next) => {
    try {
        //extract data from request
        //validate data
        //check if the duplicate user exist or not
        //check avatar and cover images are stored perfectly
        //if stored store avatar and cover image in cloudinary
        //if avatar and cover image are stored perfectly in cloudinary then extract their urls
        //now create new user in mongo db using model
        //remove password and refreshToken fields and send the newly created user as response
        const { userName, email, password, fullName } = req.body


        if ([userName, email, password, fullName].some(field => !field || field.trim() === '')) throw new ApiError(400, 'All fields are required')

        const duplicateUser = await User.findOne({
            $or: [
                { email },
                { userName }
            ]
        })

        if (duplicateUser) throw new ApiError(409, 'User with same user name or email already exist')



        const avatarFilePath = req.files?.avatar?.[0]?.path
        const coverImageFilePath = req.files?.coverImage?.[0]?.path

        if (!avatarFilePath) throw new ApiError(400, 'Avatar file is required')

        const avatarUrl = (await uploadOnCloudinary(avatarFilePath))?.url

        if (!avatarUrl) throw new ApiError(500, 'Unable to upload avatar')

        let coverImageUrl = ''

        if (coverImageFilePath) {
            coverImageUrl = (await uploadOnCloudinary(coverImageFilePath))?.url
            if (!coverImageUrl && coverImageUrl !== '') throw new ApiError(500, 'Unable to upload cover image')
        }

        const newUser = await User.create({
            userName: userName.toLowerCase(),
            email,
            fullName,
            password,
            avatar: avatarUrl,
            coverImage: coverImageUrl
        })

        const userDataResponse = await User.findById(newUser._id).select('-password -refreshToken')

        if (!userDataResponse) throw new ApiError(500, 'Unable to create user')

        res.status(200).json(
            new ApiResponse(201, 'User created successfully', userDataResponse)
        )
    } catch (error) {
        throw error
    }
})

const login = asyncHandler(async (req, res, next) => {
    try {

        //extract data from req conduct verification
        //check user exists or not
        //if user exists compare his/her password
        //password correct->then return generate access token and refresh token for the particular user
        //store refresh token in the database
        //return refresh token and access token
        const { email, userName, password } = req.body

        if (!email && !userName) throw new ApiError(400, 'Username or email is required')

        if (password?.trim() === '') throw new ApiError(400, 'Password is required')

        const user = await User.findOne({
            $or: [
                { email },
                { userName }
            ]
        })

        if (!user) throw new ApiError(404, 'User with provided email or username dosent exist')

        if (!(await user.isPasswordCorrect(password))) throw new ApiError(401, 'Invalid password')


        const accessToken = user.generateAccessToken()

        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

        const cookieOptions = {
            secure: false,
            httpOnly: true, // Can be used if you're not accessing cookies via JavaScrip
        }

        res.status(200).
            cookie('accessToken', accessToken, cookieOptions).
            cookie('refreshToken', refreshToken, cookieOptions).
            json(
                new ApiResponse(200, 'User logged in successfully', {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                })
            )
    } catch (error) {
        throw error
    }

})

const logout = asyncHandler(async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: ''
                }
            },
            {
                new: true
            }
        )


        if (!updatedUser) throw new ApiError(500, 'Internal Server Error')

        const cookieOptions = {
            httpOnly: true,
            secure: true
        }

        res.status(200)
            .clearCookie('accessToken', cookieOptions)
            .clearCookie('refreshToken', cookieOptions)
            .json(
                new ApiResponse(200, 'User logged out successfully', {})
            )
    } catch (error) {
        throw error
    }
})

const refreshAccessToken = asyncHandler(async (req, res, next) => {
    console.log('i reached here')
    try {
        const token = req.cookies?.refreshToken || req.header('x-refresh-token')?.replace('Refresh ', '')

        if (!token) throw new ApiError(401, 'Unauthorized access')

        const decodedVal = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedVal?._id)

        if (!user) throw new ApiError(401, 'Invalid token')


        if (token !== user.refreshToken) {
            throw new ApiError(401, 'Unauthorized access')
        }

        const accessToken = user.generateAccessToken()

        const cookieOption = {
            httpOnly: true,
            secure: true,
        }

        res.status(200).
            cookie('accessToken', accessToken, cookieOption)
            .json(
                new ApiResponse(200, 'Access token refreshed successfully', {
                    'accessToken': accessToken
                })
            )

    } catch (error) {
        throw error
    }
})

const changePassword = asyncHandler(async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) throw new ApiError(400, 'Both current password and new password are required')

        const user = await User.findById(req.user._id)

        if (!user) throw new ApiError(500, 'Internal server error')

        if (!(await user.isPasswordCorrect(currentPassword))) throw new ApiError(401, 'Current Password dosent match')

        user.password = newPassword

        await user.save({ validateBeforeSave: false })

        res.
            status(200).
            json(
                new ApiResponse(200, 'Password changed successfully', {})
            )
    } catch (error) {
        throw error
    }
})

const updateAvatar = asyncHandler(async (req, res, next) => {
    const avatarFilePath = req.files?.[0]?.path

    if (!avatarFilePath) throw new ApiError(400, 'Avatar file is required')

    const avatarUrl = (await uploadOnCloudinary(avatarFilePath))?.url

    if (!avatarUrl) throw new ApiError(500, 'Internal Server Error')

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatarUrl
            }
        },
        { new: true }
    )

    if (!user) throw new ApiError(500, 'Internal Server Error')

    res.
        status(200).
        json(
            new ApiResponse(201, 'Avatar changed successfully', {
                user
            })
        )

})

const subsribe = asyncHandler(async (req, res, next) => {
    try {
        const { channelUserName } = req.query

        if (!channelUserName) throw new ApiError(400, 'Channel name missing')

        const subscribedChannel = (await User.find({ userName: channelUserName }))?.[0]

        if (!subscribedChannel) throw new ApiError(400, 'Channel dosent exists')

        const subscribingChannel = await User.findById(req.user._id)

        console.log(subscribedChannel)

        const newSubscription = await Subscription.create(
            {
                subscriber: subscribingChannel._id,
                channel: subscribedChannel._id
            }
        )

        if (!newSubscription) throw new ApiError(500, 'Internal server error')

        res.
            status(200).
            json(
                new ApiResponse(201, 'Channel Subscribed successfully', { newSubscription })
            )
    } catch (error) {
        throw error
    }
})

const getUserProfile = asyncHandler(async (req, res, next) => {
    try {
        const { userId } = req.query


        if (!userId) throw new ApiError(400, 'User Id is required')

        console.log(req.user?._id)

        const profile = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                },
            },
            {
                $lookup: {
                    from: 'subscriptions',
                    localField: '_id',
                    foreignField: 'channel',
                    as: 'Subscribers'
                }

            },
            {
                $lookup: {
                    from: 'subscriptions',
                    localField: '_id',
                    foreignField: 'subscriber',
                    as: 'SubscribedTo',
                }
            },
            {
                $addFields: {
                    subscribersCount: {
                        $size: '$Subscribers'
                    },
                    subscribedToCount: {
                        $size: '$SubscribedTo'
                    },
                    isSubscribed: {
                        $in: [req.user?._id, {
                            $map: {
                                input: '$Subscribers',
                                as: 'subscriber',
                                in: '$$subscriber.subscriber'
                            }
                        }]
                    }
                }
            },
            // {
            //     $project: {
            //         userName: 1,
            //         email: 1,
            //         fullName: 1,
            //         avatar: 1,
            //         coverImage: 1,
            //         subscribersCount: 1,
            //         subscribedToCount: 1,
            //         isSubscribed: 1
            //     }
            // }
        ])

        console.log(profile)

        if (!profile.length) throw new ApiError(400, 'Channel dosent exist')

        res.
            status(200).
            json(
                new ApiResponse(200, 'User Retrieved successfully', { ...profile?.[0] })
            )
    } catch (error) {
        throw error
    }

})

const getWatchHistory = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.aggregate([
            {
                $match: {
                    userName: req.user?.userName
                },
            },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'watchHistory',
                    foreignField: '_id',
                    as: 'History',
                }
            },
            {
                $addFields: {
                    History: {
                        $map: {
                            input: '$watchHistory',
                            as: 'id',
                            in: {
                                $arrayElemAt: [
                                    '$History',
                                    { $indexOfArray: ['$History._id', '$$id'] },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    watchHistory: 1,
                    History: 1
                }
            }
        ])


        if (!user.length) throw new ApiError(404, 'User dosent exist')
            
        res.
            status(200).
            json(new ApiResponse(201, 'Users history retrieved successfully', { videos: user[0].History }))
    } catch (error) {
        throw error
    }
})

const removeVideoFromHistory = asyncHandler(async (req, res, next) => {
    console.log('deleting')

    const { videoId } = req.query

    if (!videoId) throw new ApiError(400, 'Bad request')

    const [{watchHistory:updatedWatchHistory}] = await User.aggregate([
        {
            $match:{userName: req.user?.userName}
        },
        {
            $addFields:{
                watchHistory:{
                    $filter:{
                        input:'$watchHistory',
                        as:'id',
                        cond:{$ne:['$$id',{$toObjectId:videoId}]}
                    } 
                }
            }
        }
    ])

    console.log(updatedWatchHistory)

    const user=await User.findById(req.user?._id)

    user.watchHistory=updatedWatchHistory

    console.log(user)

    await user.save({validateBeforeSave:false})

    res.status(200).json(new ApiResponse(200, 'Watch history updated', {}))
})

const getAuthStatus = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '')

        if (token === 'null') {
            return res.status(200).json(new ApiResponse(401, 'Unauthorized Access', {
                user: null,
                isLoggedIn: false
            }))
        }


        const decodedVal = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if (decodedVal) {
            const user = await User.findById(decodedVal._id).select('-__v -createdAt -updatedAt -refreshToken -watchHistory -coverImage -password')
            return res.status(200).json(new ApiResponse(200, 'User logged in', {
                user,
                isLoggedIn: true
            }))
        }

    } catch (error) {
        if (error.message === 'jwt expired') {
            const refreshToken = req.cookies?.refreshToken || req.header('x-refresh-token')?.replace('Refresh ', '')


            if (!refreshToken) return res.status(401).json(new ApiResponse(401, 'Unauthorized Access', {
                user: null,
                isLoggedIn: false
            }))


            const decodedVal = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

            const user = await User.findById(decodedVal?._id)

            if (!user) throw new ApiError(400, 'Bad request', {})

            if (refreshToken !== user.refreshToken) {
                console.log(refreshToken, user.refreshToken)
                throw new ApiError(401, 'Unauthorized access', {})
            }

            console.log('i m here')

            const accessToken = user.generateAccessToken()

            const responseUser = await User.findById(decodedVal?._id).select('-__v -createdAt -updatedAt -refreshToken -watchHistory -coverImage -avatar -password')



            const cookieOption = {
                httpOnly: true,
                secure: true,
            }

            return res.
                status(200).
                cookie('accessToken', accessToken, cookieOption).
                json(new ApiResponse(200, 'User is logged in', {
                    user: responseUser,
                    isLoggedIn: true
                }))
        }
        console.log('throwing error')
        throw error
    }
})

export {
    registerUser,
    login,
    logout,
    refreshAccessToken,
    changePassword,
    updateAvatar,
    subsribe,
    getUserProfile,
    getWatchHistory,
    getAuthStatus,
    removeVideoFromHistory
}