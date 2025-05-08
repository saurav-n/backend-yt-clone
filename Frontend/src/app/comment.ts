import axios from "axios";
import { createPaginatedGlobalState } from ".";
import { PaginateData } from "./videos";

interface CommentType{
    _id:string,
    commentOf:string,
    replyOf:string,
    commentor:string,
    content:string,
    createdAt:string,
    replyCount:number
}

interface CommentPageData{
statusCode: number
  message: string
  data: {
    replies?:CommentType[]
    comments?: CommentType[]
    paginateData: PaginateData
  }
  success: boolean
}

const useGetComments=createPaginatedGlobalState<CommentPageData>((videoId)=>async ({pageParam})=>{
    try {
        console.log(videoId)
        const response=await axios.get(`http://localhost:3000/api/v1/comments/getComments?videoId=${videoId}&pageNo=${pageParam}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'x-refresh-token': `Refresh ${localStorage.getItem('refreshToken')}`,
              },
        })
        return response.data
    } catch (error) {
        throw error
    }
},['comments'],(lastPage,allPages)=>{return lastPage.data.paginateData?.hasNextPage ? lastPage.data.paginateData.nextPage : undefined})

const useGetCommentReplies=createPaginatedGlobalState<CommentPageData>((commentId)=>async({pageParam})=>{
    try {
        const response=await axios.get(`http://localhost:3000/api/v1/comments/getCommentReplies?commentId=${commentId}&pageNo=${pageParam}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'x-refresh-token': `Refresh ${localStorage.getItem('refreshToken')}`,
              },
        })
        return response.data
    } catch (error) {
        throw error
    }
},['replies'],(lastPage,allPages)=>{return lastPage.data.paginateData.hasNextPage ? lastPage.data.paginateData.nextPage : undefined})

export {
    useGetComments,
    useGetCommentReplies
}

export type{CommentType,CommentPageData}