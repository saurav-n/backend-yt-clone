import { Suspense, useState } from "react"
import ProfileIcon from "./ProfileIcon"
import { Skeleton } from "./ui/skeleton"

export default function CommentBox({handleCommentPost,hide}:
    {
        handleCommentPost:(comment:string)=>()=>Promise<void>,
        hide?:()=>void
    }) {
    const [newComment,setNewComment]=useState<string>('')
    return (
        <div className="flex justify-center w-full py-2 gap-x-2">
            <div className="w-10 aspect-square rounded-full overflow-clip self-start">
                <Suspense fallback={ <Skeleton className="w-11 h-11 rounded-full bg-orange-100" />}>
                    <ProfileIcon isUserNameShown={false}/>
                </Suspense>
            </div>
            <div className="flex flex-col gap-y-2">
                <input type="text" name="" id="" placeholder="Write a comment"
                    className="w-full outline-none border-b-2 border-slate-400"
                    onChange={(e) => setNewComment(e.currentTarget.value)}
                    value={newComment}
                />
                <button className="py-2 px-3 text-white bg-orange-300 hover:bg-orange-400 rounded-2xl w-fit transition-all self-end"
                    disabled={newComment.length <= 0}
                    onClick={async () => {
                        const onCommentPost=handleCommentPost(newComment)

                        const response=await onCommentPost()

                        setNewComment('')
                        if(hide) hide()
                            
                    }}
                >
                    Add
                </button>
            </div>
        </div>
    )
}