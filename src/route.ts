import { Router } from "express";
import authRouter          from "./app/auth/auth.rout";
import { userRouter }      from "./app/user/user.rout";
import { postRouter }      from "./app/post/post.rout";
import { commentRouter }   from "./app/comment/comment.rout";

export const router = Router();

router.use('/auth',    authRouter);
router.use('/user',    userRouter);
router.use('/post',    postRouter);
router.use('/comment', commentRouter);
