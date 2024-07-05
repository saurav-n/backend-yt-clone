import multer from "multer";
import path from 'path'
const storage=multer.diskStorage({
    filename:function (req,file,cb){
        cb(null,file.originalname)
    },
    destination:function (req,file,cb){
        cb(null,path.resolve('./public/temp'))
    }
})

const upload=multer({storage:storage})

export default upload