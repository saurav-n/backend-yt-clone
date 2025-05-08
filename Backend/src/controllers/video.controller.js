import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Video from "../models/video.model.js";
import View from "../models/view.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";

const uploadVideo = asyncHandler(async (req, res, next) => {
    try {

        console.log('started to create new video')

        const videoFilePath = req.files?.video?.[0].path
        const thumbnailFilePath = req.files?.thumbnail?.[0].path

        const { title, description } = req.body

        if ([title, description, videoFilePath, thumbnailFilePath].some(element => !element)) throw new ApiError(400, 'All fileds are required')

        console.log('the line before uploading the video in the cloudinary')

        const videoRes = await uploadOnCloudinary(videoFilePath)

        console.log('uploaded video')

        const thumbNailRes = await uploadOnCloudinary(thumbnailFilePath)

        if (!videoRes || !thumbNailRes) throw new ApiError(500, 'Internal server error')


        const newVideo = await Video.create({
            videoFile: videoRes.url,
            thumbnail: thumbNailRes.url,
            owner: req.user?._id,
            title,
            description,
            duration: videoRes.duration
        })

        if (!newVideo) throw new ApiError(500, 'Internal Server Error')

        console.log('new video created')
        

        res.
            status(200).
            json(new ApiResponse(200, 'Video uploaded successfully', newVideo))
    } catch (error) {
        throw error
    }
})

const watchVideo = asyncHandler(async (req, res, next) => {
    console.log('watching video')
    try {
        const { id: videoId } = req.query


        if (!videoId) throw new ApiError(400, 'Missing parameters')



        if (!(await Video.findById(videoId))) throw new ApiError(400, 'No such Video')

        const views = await View.find({
            $and: [
                { viewer: req.user?._id },
                { video: videoId }
            ]
        })

        console.log(views)

        const [{ watchHistory: updatedWatchHistory }] = await User.aggregate([
            {
                $match: { _id: req.user?._id }
            },
            {
                $set: {
                    watchHistory: {
                        $filter: {
                            input: '$watchHistory',
                            as: 'videoId',
                            cond: { $ne: ['$$videoId', { $toObjectId: videoId }] }
                        }
                    },
                }
            },
            {
                $set: {
                    watchHistory: {
                        $cond: {
                            if: { $gte: [{ $size: '$watchHistory' }, 10] },
                            then: { $slice: ['$watchHistory', 0, 9] },
                            else: '$watchHistory'
                        }
                    }
                }
            },
            {
                $set: {
                    watchHistory: {
                        $concatArrays: [[{ $toObjectId: videoId }], '$watchHistory']
                    }
                }
            }
        ])



        if (!updatedWatchHistory) throw new ApiError(500, 'Internal Sever Error')

        const updatedUser = await User.findByIdAndUpdate(req.user?._id,
            {
                $set: {
                    watchHistory: updatedWatchHistory
                }
            },
            { new: true }
        )

        if (typeof updatedUser === 'undefined') throw new ApiError(500, 'Internal Server Error')

        const isVideoAlreadyWatched = views.length > 0

        if (!isVideoAlreadyWatched) {
            console.log('new view detected')
            const newView = await View.create({
                viewer: req.user?._id,
                video: videoId
            })

            const video = await Video.findByIdAndUpdate(videoId,
                {
                    $inc: {
                        views: 1
                    }
                },
                { new: true }
            )

            if (!video) throw new ApiError(400, 'No such video exist')
        }

        res.status(200).json(new ApiResponse(200,'Successful',{}))
    } catch (error) {
        throw error
    }
})

const getVideo = asyncHandler(async (req, res, next) => {
    try {
        const { videoId } = req.query

        if (!videoId) throw new ApiError(400, 'Bad request')

        const video = await Video.findById(videoId)

        if (!video) throw new ApiError(500, 'Internal Server Error')

        res.send(new ApiResponse(200, 'got video', video))
    } catch (error) {
        throw error
    }
})

const getVideos = asyncHandler(async (req, res, next) => {
    try {
        const { pageNo } = req.query

        if (!pageNo) throw new ApiError(400, 'Bad request')

        const paginateOptions = {
            page: Number(pageNo),
            limit: 25,
        }
        const videoResult = await Video.aggregatePaginate([

        ], paginateOptions)

        const { docs: videos, ...paginateData } = videoResult


        res.status(200).
            json(new ApiResponse(200, 'videos retrieved successfully', { videos, paginateData }))
    } catch (error) {
        throw error
    }
})

export {
    uploadVideo,
    watchVideo,
    getVideos,
    getVideo
}