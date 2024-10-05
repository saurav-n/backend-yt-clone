import { Router } from "express";
import {getUserProfile, getWatchHistory, registerUser} from '../controllers/user.controller.js'
import { login } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { logout } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../controllers/user.controller.js";
import { changePassword } from "../controllers/user.controller.js";
import { updateAvatar } from "../controllers/user.controller.js";
import { subsribe } from "../controllers/user.controller.js";

const router=Router()

router.route('/register').post(upload.fields([
    {name:'avatar',maxCount:1},
    {name:'coverImage',maxCount:1}
]),registerUser)

router.route('/login').post(login) 

router.route('/logout').post(verifyToken,logout)

router.route('/refreshAccessToken').post(refreshAccessToken)

router.route('/changePassword').post(verifyToken,changePassword)

router.route('/changeAvatar').post(verifyToken,upload.array('avatar',1),updateAvatar)

router.route('/subscribeTo').post(verifyToken,subsribe)

router.route('/getUser').get(verifyToken,getUserProfile)

router.route('/getWatchHistory').get(verifyToken,getWatchHistory)

export default router