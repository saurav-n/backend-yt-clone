import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { getVideos, uploadVideo, watchVideo } from "../controllers/video.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router=Router()

router.route('/upload').post(verifyToken,upload.fields([
    {name:'video',maxCount:1},
    {name:'thumbnail',maxCount:1}
]),uploadVideo)

router.route('/watch').post(verifyToken,watchVideo)

router.route('/getVideos').get(verifyToken,getVideos)

export default router