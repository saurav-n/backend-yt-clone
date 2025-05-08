import { useEffect, useState } from "react";
import { BsDot } from "react-icons/bs";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import { CommentType, useGetCommentReplies, useGetComments } from "@/app/comment";
import useGetChannel from "@/app/profile";
import convertTimeStamp from "@/utils/TimeStampConvert";
import CommentBox from "./CommentBox";
import CommentLoader from "./CommentLoader";
import { useInView } from "react-intersection-observer";
import axios from "axios";

type CommentProps = {
    comment: CommentType
}

export default function Comment({ comment }: CommentProps) {
    const { data, hasNextPage, fetchNextPage,refecthData:refetchReplies } = useGetCommentReplies(comment._id)
    const { data: commentorDetails } = useGetChannel(comment.commentor)
    const [areRepliesShown, setAreRepliesShown] = useState<boolean>(false)
    const [isCommentBoxHidden, setIsCommentBoxHidden] = useState<boolean>(true)
    const { inView, ref } = useInView()
    useEffect(()=>{
        console.log(data)
    },[data])
    useEffect(() => {
        if (inView && hasNextPage) fetchNextPage()
    }, [hasNextPage, inView])
    return (
        <div className="flex flex-col gap-y-2">
            <div className="w-full flex gap-x-2 items-center">
                <div className="w-14 aspect-square self-start rounded-full  overflow-clip">
                    <img src={commentorDetails?.avatar} alt="" className="w-full h-full" />
                </div>
                <div className="flex flex-col w-full justify-between">
                    <span className="flex gap-x-1 items-center">
                        <p className="font-bold">{commentorDetails?.userName}</p>
                        <BsDot className="text-sm text-gray-500" />
                        <p className="text-sm text-gray-500">{convertTimeStamp(comment.createdAt)}</p>
                    </span>
                    <p>{comment.content}</p>
                </div>
            </div>
            <div className="flex w-full justify-between">
                <button className={`flex gap-x-1 text-blue-500 ${comment.replyCount > 0 ? '' : 'hidden'}`}
                    onClick={() => setAreRepliesShown(!areRepliesShown)}>
                    <div>
                        {areRepliesShown ? (<FaAngleUp />) : (<FaAngleDown />)}
                    </div>
                    <p>{`${comment.replyCount} replies`}</p>
                </button>
                <div className="flex gap-x-1 ml-auto">
                    <button className="hover:bg-slate-100 p-1 rounded-md ml-auto text-sm" onClick={() => setIsCommentBoxHidden(false)}>
                        Reply
                    </button>
                    <button className={`${isCommentBoxHidden ? 'hidden' : ''} hover:bg-slate-100 p-1 rounded-md  text-sm`}
                        onClick={() => setIsCommentBoxHidden(true)}
                    >
                        Cancel Reply
                    </button>
                </div>
            </div>
            <div className={`ml-6 flex flex-col gap-y-2 ${areRepliesShown ? '' : 'hidden'}`}>
                {
                    data.pages.map(page => (
                        <>
                            {
                                page.data.replies?.map(reply => (
                                    <Comment comment={reply} key={reply._id} />
                                ))
                            }
                        </>
                    ))
                }
                <div ref={ref} className={`${hasNextPage ? '' : 'hidden'}`}>
                    <CommentLoader />
                </div>
            </div>
            <div className={`${isCommentBoxHidden ? 'hidden' : ''}`}>
                <CommentBox handleCommentPost={(newComment) => {
                    const onCommentPost = async () => {
                        const response = await axios.post('http://localhost:3000/api/v1/comments/createComment', {
                            replyOf:comment._id,
                            content: newComment,
                        }, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                                'x-refresh-token': `Refresh ${localStorage.getItem('refreshToken')}`,
                            },
                        })
                        refetchReplies()
                    }
                    return onCommentPost
                }} hide={()=>setIsCommentBoxHidden(true)} />
            </div>
        </div>
    )
}