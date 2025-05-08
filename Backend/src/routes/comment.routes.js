import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createComment, getCommentReplies, getComments } from "../controllers/comment.controller.js";

const router = Router()

router.route('/createComment').post(verifyToken,createComment)

router.route('/getComments').get(verifyToken,getComments)

router.route('/getCommentReplies').get(verifyToken,getCommentReplies)

export default router