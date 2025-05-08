import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { getVideo, getVideos, uploadVideo, watchVideo } from "../controllers/video.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router=Router()

router.route('/upload').post(verifyToken,upload.fields([
    {name:'video',maxCount:1},
    {name:'thumbnail',maxCount:1}
]),uploadVideo)

router.route('/watch').post(verifyToken,watchVideo)

router.route('/getVideos').get(getVideos)

router.route('/getVideo').get(verifyToken,getVideo)

export default router