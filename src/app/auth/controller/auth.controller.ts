import { NextFunction, Request, Response } from "express";
import  { AuthService } from "../service/auth.service";
import { setCookies } from "../utils";
import { AppError } from "../../../lib/error/error";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/tokens";
@injectable()
 export class AuthController {

    constructor(@inject(TOKENS.AuthService)private authService: AuthService) {
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json({ message: 'User created successfully', success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.verifyAccount(req.body);
            res.status(200).json({ message: 'Account verified successfully', success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.authService.login(req.body);
            if (!result) {
                return res.status(200).json({
                    message: 'Two-step verification code sent to your email',
                    success: true
                });
            }
            setCookies(res, result.accessToken, result.refreshToken);
            res.status(200).json({
                message: 'Logged in successfully',
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    verifyCodeTwoStepVerification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.authService.vverifyCodeTwoStepVerification(req.body);
            setCookies(res, result.accessToken, result.refreshToken);
            res.status(200).json({
                message: 'Two-step verification verified successfully',
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    enable2StepVerification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.enable2StepVerification(req.body);
            res.status(200).json({
                message: 'Two-step verification code sent to your email',
                success: true
            });
        } catch (error) {
            next(error);
        }
    }

    verifyCodeActiveTwoStepVerification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.verifyCodeActiveTwoStepVerification(req.body);
            res.status(200).json({
                message: 'Two-step verification activated successfully',
                success: true
            });
        } catch (error) {
            next(error);
        }
    }

    sendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.sendOtp(req.body);
            res.status(200).json({
                message: 'OTP sent successfully',
                success: true
            });
        } catch (error) {
            next(error);
        }
    }

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.resetPassword(req.body);
            res.status(200).json({
                message: 'Password reset successfully',
                success: true
            });
        } catch (error) {
            next(error);
        }
    }

    loginWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const idToken = req.body.idToken || req.body.token;
            if (!idToken) {
                throw new AppError('Google ID token is required', 400);
            }
            const accessToken = await this.authService.loginWithCGoogle(idToken);
            res.status(200).json({
                message: 'Logged in with Google successfully',
                success: true,
                data: { accessToken }
            });
        } catch (error) {
            next(error);
        }
    }

    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies?.refresh_token || req.body?.refreshToken || req.body?.token;
            if (!token) {
                throw new AppError('Refresh token is required', 400);
            }
            const result = await this.authService.refreshTokenFn(token);
            setCookies(res, result.accessToken, result.refreshToken);
            res.status(200).json({
                message: 'Token refreshed successfully',
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

