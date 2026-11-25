import container from '../../lib/di/container';
import { Router } from "express";
import { uploadSingle } from "../../lib/media/multer";
import { authGuard } from "../../lib/auth/authGuard";
import { UserController } from './controller/user.controller';
import { TOKENS } from '../../lib/di/tokens';

const userController = container.resolve<UserController>(TOKENS.UserController);
export const userRouter = Router();

userRouter.use(authGuard);

userRouter.post('/upload-profile-picture', uploadSingle('pp'), userController.uploadProfilePicture);
userRouter.post('/generate-presigne-url', userController.generatePresigneUrl);
userRouter.delete('/delete-profile-picture', userController.deletProfilePicture);

userRouter.get('/me', userController.getMyProfile);
userRouter.patch('/me', userController.updateProfile);

userRouter.get('/settings', userController.getAccountSettings);
userRouter.patch('/settings/privacy', userController.updatePrivacy);

userRouter.get('/search', userController.searchUsers);
userRouter.get('/suggestions', userController.getSuggestedUsers);

userRouter.post('/follow-requests/:requesterId/accept', userController.acceptFollowRequest);
userRouter.delete('/follow-requests/:requesterId/reject', userController.rejectFollowRequest);

userRouter.get('/:userId', userController.getUserProfile);
userRouter.post('/:userId/follow', userController.followUser);
userRouter.delete('/:userId/unfollow', userController.unfollowUser);
userRouter.get('/:userId/followers', userController.getFollowers);
userRouter.get('/:userId/following', userController.getFollowing);
