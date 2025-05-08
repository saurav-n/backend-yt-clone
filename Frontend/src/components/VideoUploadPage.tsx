import Container from "./container";
import { useForm } from "react-hook-form";
import VideoUploadInput from "./VideoUploadInput";
import { useState } from "react";
import ImageInput from "./fileInput";
import Loader from "./Loader";
import { useErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router";
import axios from "axios";

export default function VideoUploadPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
    const [titleTypedChars, setTitleTypedChars] = useState(0)
    const [descTypedChars, setDescTypedChars] = useState(0)
    const [videoFiles, setVideoFiles] = useState<File[]>([])
    const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([])
    const {showBoundary}=useErrorBoundary()
    const navigate=useNavigate()
    const [isLoading,setIsLoading]=useState(false)

    const onVideoSubmit = (data: any) => {
        const submitVideo=async ()=>{
            try {
                setIsLoading(true)
                const formData=new FormData()
                formData.append('title',data.videoTitle)
                formData.append('description',data.videoDescription)
                formData.append('video',videoFiles[0])
                formData.append('thumbnail',thumbnailFiles[0])

                const response=await axios.post('http://localhost:3000/api/v1/videos/upload',formData,{
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem('accessToken')}`,
                        'x-refresh-token':`Refresh ${localStorage.getItem('refreshToken')}`,
                    },
                })

                console.log(response)
                navigate('/')
            } catch (error) {
                showBoundary(error as Error)
            }finally{
                setIsLoading(false)
            }
        }

        submitVideo()
    }


    return (
        <Container>
            <div className="bg-slate-50 flex-col gap-y-2">
                <div className="bg-orange-200 rounded-t-lg flex flex-col items-center justify-center gap-y-2 py-1 w-full">
                    <p className="font-bold text-xl">Upload Your Video</p>
                    <p className="text-gray-600 text-sm">For better expirience,upload a thumbnail with dimension 300 x 170px</p>
                </div>
                <form
                    action=""
                    className="flex flex-col gap-y-2 px-2 py-4"
                    onSubmit={handleSubmit(onVideoSubmit)}
                >
                    <div className="flex gap-x-2">
                        <div className="flex flex-col gap-y-3">
                            <VideoUploadInput
                                label="Title"
                                maxChars={50}
                                typedChars={titleTypedChars}
                                {...register('videoTitle', {
                                    onChange: (e) => {
                                        setTitleTypedChars(e.target.value.length)
                                    }
                                })}
                            />
                            {errors.videoTitle &&
                                <p className="text-sm text-red-500 py-1">
                                    {typeof errors.videoTitle.message === 'string' ? errors.videoTitle.message : ''}
                                </p>
                            }
                            <VideoUploadInput
                                label="Description"
                                maxChars={200}
                                typedChars={descTypedChars}
                                {...register('videoDescription', {
                                    onChange: (e) => {
                                        setDescTypedChars(e.target.value.length)
                                    },
                                    required: 'Description is required'
                                })}
                            />
                            {errors.videoDescription &&
                                <p className="text-sm text-red-500 py-1">
                                    {typeof errors.videoDescription.message === 'string' ? errors.videoDescription.message : ''}
                                </p>
                            }
                        </div>
                        <div className="flex gap-x-1">
                            <ImageInput
                                label="Video"
                                accept="video/*"
                                inputWidth={200}
                                files={videoFiles}
                                setFiles={setVideoFiles}
                                maxFiles={1}
                                isRequired={true}
                            />
                            <ImageInput
                                label="Thumbnail"
                                accept="image/*"
                                inputWidth={200}
                                files={thumbnailFiles}
                                setFiles={setThumbnailFiles}
                                maxFiles={1}
                                isRequired={true}
                            />
                        </div>
                    </div>
                    <button type="submit" className={`w-full ${isSubmitting ? 'bg-transparent border-2 border-orange-300' : 'bg-orange-300'} rounded-md py-2 ${isSubmitting ? '' : 'hover:bg-orange-400'} transition-all flex justify-center items-center`}>
                        {isLoading ? (<Loader height="10" width="10" color="orange" />) : 'Submit'}
                    </button>
                </form>
            </div>
        </Container>
    )
}