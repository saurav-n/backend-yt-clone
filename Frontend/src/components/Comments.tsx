import { useGetComments } from "@/app/comment"
import { Suspense, useEffect, useState } from "react"
import CommentLoader from "./CommentLoader"
import Comment from "./Comment"
import { useInView } from "react-intersection-observer"
import axios from "axios"
import CommentBox from "./CommentBox"

export default function Comments({ videoId }: { videoId?: string }) {
    const { data, hasNextPage, fetchNextPage, refecthData: refetchCommentData } = useGetComments(videoId)

    const { inView, ref } = useInView()


    useEffect(() => {
        if (hasNextPage && inView) fetchNextPage()
    }, [hasNextPage, inView])

    return (
        <div className="flex flex-col gap-y-3">
            <div className="max-h-[730px] w-[400px]  overflow-y-scroll py-2 flex flex-col gap-y-3 border-[1px] border-slate-400 rounded-lg px-3">
                {
                    data.pages.map(page => (
                        <>
                            {
                                page.data.comments?.map(comment => (
                                    <Suspense key={comment._id} fallback={<CommentLoader />}>
                                        <Comment comment={comment} />
                                    </Suspense>
                                ))
                            }
                        </>
                    ))
                }
                <div ref={ref} className={`${!hasNextPage ? 'hidden' : ''}`}>
                    <CommentLoader />
                </div>
            </div>
            <CommentBox handleCommentPost={(newComment) => {
                const onCommentPost = async () => {
                    const response = await axios.post('http://localhost:3000/api/v1/comments/createComment', {
                        commentOf: videoId,
                        content: newComment,
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                            'x-refresh-token': `Refresh ${localStorage.getItem('refreshToken')}`,
                        },
                    })
                    refetchCommentData()
                }
                return onCommentPost
            }
            } />
        </div>
    )
}