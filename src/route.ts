import { Router } from "express";
import authRouter from "./app/auth/auth.rout";
import { userRouter } from "./app/user/user.rout";

export const router = Router();

router.use('/auth', authRouter);
router.use('/user',userRouter);
// router.use('/post');
// router.use('/comment');
