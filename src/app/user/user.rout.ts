import container from '../../lib/di/container'
import { Router } from "express";
import { uploadSingle } from "../../lib/media/multer";
import { authGuard } from "../../lib/auth/authGuard";
import { UserController } from './controller/user.controller';
import { TOKENS } from '../../lib/di/tokens';
const userController=container.resolve<UserController>(TOKENS.UserController)
 export const userRouter= Router();
userRouter.post('/upload-profile-picture',uploadSingle('pp'),userController.uploadProfilePicture)
userRouter.post('/generate-presigne-url',userController.generatePresigneUrl)
userRouter.delete('/delete-profile-picture',userController.deletProfilePicture)