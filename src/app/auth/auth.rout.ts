import { Router } from "express";
import container from '../../lib/di/container'
import { TOKENS } from '../../lib/di/tokens';
import { AuthController } from "./controller/auth.controller";
const authController=container.resolve<AuthController>(TOKENS.AuthController)
const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/verify-account', authController.verifyAccount);
authRouter.post('/login', authController.login);
authRouter.post('/verify-2step', authController.verifyCodeTwoStepVerification);
authRouter.post('/enable-2step', authController.enable2StepVerification);
authRouter.post('/verify-active-2step', authController.verifyCodeActiveTwoStepVerification);
authRouter.post('/send-otp', authController.sendOtp);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.post('/google', authController.loginWithGoogle);
authRouter.post('/refresh-token', authController.refreshToken);

export default authRouter;
