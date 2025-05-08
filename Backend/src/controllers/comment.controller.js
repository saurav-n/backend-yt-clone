import Comment from "../models/comment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createComment = asyncHandler(async (req, res, next) => {
    console.log('inside create comment')

    const { commentOf, replyOf, content } = req.body

    if (!content) throw new ApiError(400, 'Content is required')

    if (!commentOf && !replyOf) throw new ApiError(400, 'Missing parameters')


    const newComment = await Comment.create({
        commentor: req?.user._id,
        commentOf: commentOf ? commentOf : null,
        replyOf: replyOf ? replyOf : null,
        content
    })

    if (!newComment) throw new ApiError(500, 'Unable to create new comment')

    res.status(200).json(new ApiResponse(201, 'Comment created successfully', newComment))
})

const getComments = asyncHandler(async (req, res, next) => {
    const { videoId, pageNo } = req.query
    
    if (!videoId || !pageNo) throw new ApiError(400, 'Missing paremeters')

    const paginateOption = {
        page: Number(pageNo),
        limit: 10
    }

    const commentData = await Comment.aggregatePaginate([
        {
            $match: {
                commentOf:mongoose.Types.ObjectId.createFromHexString(videoId)
            }
        },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'replyOf',
                as: 'Replies'
            }
        },
        {
            $addFields: {
                replyCount: { $size: '$Replies' }
            }
        },
        {
            $project:{
                _id:1,
                commentOf:1,
                replyOf:1,
                commentor:1,
                content:1,
                createdAt:1,
                replyCount:1
            }
        }
    ], paginateOption)


    if (!commentData) throw new ApiError(500, 'Internal Server Error')

    const { docs: comments, ...paginateData } = commentData



    res.status(200).json(new ApiResponse(200, 'Commetns retrieved Successfully', { comments, paginateData }))

})

const getReplies = asyncHandler(async (req, res, next) => {
    const { commentId, pageNo } = req.query

    if (!commentId || !pageNo) throw new ApiError(400, 'Missing parameters')


})

const getCommentReplies = asyncHandler(async (req, res, next) => {
    const { commentId, pageNo } = req.query

    if (!commentId || !pageNo) throw new ApiError(400, 'Missing parameters')


    const paginateOption = {
        page: Number(pageNo),
        limit: 10
    }

    const { docs: replies, ...paginateData } = await Comment.aggregatePaginate([
        {
            $match: { replyOf: mongoose.Types.ObjectId.createFromHexString(commentId) }
        },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'replyOf',
                as: 'Replies'
            }
        },
        {
            $addFields: {
                replyCount: { $size: '$Replies' }
            }
        },
        {
            $project: {
                _id: 1,
                commentor: 1,
                content: 1,
                createdAt: 1,
                replyCount: 1
            }
        }
    ], paginateOption)


    // if (!comments) throw new ApiError(500, 'Internal Server Error')

    res.status(200).json(new ApiResponse(200, 'Replies retrieved Successfully', { replies, paginateData }))

})

export {
    createComment,
    getComments,
    getCommentReplies
}