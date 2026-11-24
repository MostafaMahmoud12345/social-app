import { Gender } from "../enum/enum";

export interface RegisterDto{
    userName:string,
    email:string,
    password:string,
    phoneNumber?:string,
    gender?:Gender
}
export interface VerifayAcountDto
{
    email:string,
    code:string
}
export interface LoginDto
{
    email:string,
    password:string
}
export interface SendOtpDto
{
    email:string
}
export interface ResetPasswordDto{
    code:string,
    newPassword:string
}
export interface Enable2StepVerificationDto{
email:string
}
export interface VerifyCodeActiveTwoStepVerificationDto{
    code:string,
   email:string
}
export interface VverifyCodeTwoStepVerificationDto{
    code:string,
   email:string
}