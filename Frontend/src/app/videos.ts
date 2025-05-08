import axios from "axios";
import { createPaginatedGlobalState, createGlobalState } from "."

interface Video {
  _id: string;
  videoFile: string;
  thumbnail: string;
  owner: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PaginateData {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number;
  nextPage: number;
}

interface PageData {
  statusCode: number;
  message: string;
  data: {
    videos: Video[];
    paginateData: PaginateData;
  };
  success: boolean;
}

const useGetVideos = createPaginatedGlobalState<PageData>(() => async ({ pageParam }) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/videos/getVideos?pageNo=${pageParam}`)
    return response.data
  } catch (error) {

  }
}, ['videos'], (lastPage) => {
  return lastPage.data.paginateData.hasNextPage ? lastPage.data.paginateData.nextPage : undefined
})

const useVideo = createGlobalState((videoId) => async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/videos/getVideo?videoId=${videoId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'x-refresh-token': `Refresh ${localStorage.getItem('refreshToken')}`,
      },
    })
    return response.data?.data
  } catch (error) {
    throw error
  }
}, ['video'])

const useGetWatchHistory = createGlobalState(() => async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/users/getWatchHistory', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'x-refresh-token': `Refresh ${localStorage.getItem('refreshToken')}`,
      },
    })

    return response.data?.data
  } catch (error) {
    throw error
  }
}, ['watchHistory'])

export { useGetVideos, useVideo,useGetWatchHistory };
export type { Video, PageData, PaginateData };
