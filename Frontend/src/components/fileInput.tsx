import { ChangeEvent, FC, useRef } from "react"
import { IoMdCloudUpload } from "react-icons/io";
import { FaFileAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

type ImageInputProps = {
    classname?: string
    label: string,
    accept: string,
    maxFiles: number,
    files: File[],
    setFiles: (files: File[]) => void,
    inputWidth:number,
    isRequired?: boolean
}

const ImageInput: FC<ImageInputProps> = ({ classname = '', label, accept, maxFiles, files, setFiles, inputWidth,isRequired = false }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files ? e.target.files : [])
        if (selectedFiles.length + files.length > maxFiles) {
            alert(`You can only select ${maxFiles} files`)
            return
        }
        console.log(e.target.value)
        setFiles([...selectedFiles, ...files])
    }
    return (
        <div className={`${classname} w-full max-w-[250px] flex flex-col gap-y-3`}>
            <span className="font-bold flex gap-x-1 text-sm">{`${label}`} {isRequired ? (<p className="text-red-500">*</p>) : ''}</span>
            <div
                className={`w-full max-w-[${inputWidth}px] aspect-square border-2 border-dashed border-orange-500 flex flex-col justify-center items-center rounded-md text-orange-400 cursor-pointer text-4xl md:text-6xl px-2`}
                onClick={() => {
                    fileInputRef.current?.click()
                }}
                onDragOver={(e) => {
                    e.preventDefault()
                    console.log('something is dragged on me')
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    const droppedFile = e.nativeEvent.dataTransfer?.files?.[0]
                    if (!droppedFile) return
                    if (!droppedFile.type.includes('image')) {
                        alert(`${droppedFile.type} is not acceptable`)
                        return
                    }
                    const imgType = droppedFile.type.substring(6)
                    if (accept.substring(6) !== '*' && accept.substring(6) !== imgType) {
                        alert(`${droppedFile.type} is not acceptable`)
                        return
                    }
                    const selectedFiles = [droppedFile]
                    if (selectedFiles.length + files.length > maxFiles) {
                        alert(`You can only select ${maxFiles} files`)
                        return
                    }
                    setFiles([...selectedFiles, ...files])
                }}
            >
                <input
                    type="file"
                    accept={accept}
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <IoMdCloudUpload />
                <p className="text-base font-bold text-center">Browse or</p>
                <p className="text-base font-bold text-center">Drag and Drop</p>
            </div>
            <div className="w-full max-w-[200px] max-h-[400px] flex flex-col  gap-y-1 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-50 scrollbar-track-transparent no-scrollbar-arrows">
                {
                    files.map((file) => {
                        return (
                            <div
                                className="w-full bg-slate-100 flex  gap-x-1  items-center justify-center rounded-md py-2 px-2 font-medium"
                                key={file.name}
                            >
                                <FaFileAlt className="text-5xl text-orange-300" />
                                <div className="flex w-full flex-col gap-y-1">
                                    <div className="w-full flex justify-between items-center">
                                        <div className="flex justify-between gap-x-1 items-center">
                                            <p>{file.name.length > 8 ? `${file.name.substring(0, 8)}...` : file.name}</p>
                                        </div>
                                        <p>50kb</p>
                                    </div>
                                    <div className="w-full flex justify-between items-center">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="profile"
                                            className="w-h-8 h-8"
                                        />
                                        <button
                                            onClick={() => {
                                                setFiles(files.filter((selectedFile) => selectedFile.name !== file.name))
                                            }}
                                        >
                                            <MdDelete className="text-xl text-red-500 hover:text-red-700 transition-all" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ImageInput