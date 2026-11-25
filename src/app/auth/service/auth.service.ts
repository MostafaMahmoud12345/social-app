import  Jwt  from 'jsonwebtoken';
import { AppError } from '../../../lib/error/error';
import { mailjetProvider, nodeMailerProvider } from './../../../lib/email/init';
import {LoginDto, RegisterDto, SendOtpDto,VerifayAcountDto,Enable2StepVerificationDto,ResetPasswordDto,VerifyCodeActiveTwoStepVerificationDto, VverifyCodeTwoStepVerificationDto} from "../dto/dto";
import { UserRepository } from "../../user/repository/user.repository";
import { generateOTPCode } from "../../../lib/utils/otp";
import { userAlreadyExist,userNotExist,userNotVerified,userAlreadyVerified} from "../../user/errors";
import { otpExpired,invalidCode,invalidPassword} from '../errors';
import { hashPassword ,comparePassword,generateAccessToken,generateRefreshToken,setCookies} from "../utils";
import {cacheProvider} from '../../../lib/cache/init'
import { toSeconds } from '../../../pkg/utils/time';
import { INotifactionProvider } from '../../../pkg/notifaction/notifaction.interface';
import { verifyGoogleToken } from '../../../lib/utils/google.auth';
import { Provider } from '../enum/enum';
import { TuserPayloud } from '../../../lib/interface/userPayloud.type';
import { env } from '../../../lib/config/env';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../lib/di/tokens';

@injectable()
export class AuthService{
   private twoStepVerificationKey = '2-step-verification:';
  private sendOtpKey = 'otp:';
  
    constructor(@inject(TOKENS.UserRepository)private readonly userRepository:UserRepository,@inject(TOKENS.NodeMailerProvider) private readonly mailProvider:INotifactionProvider){
      this.mailProvider=nodeMailerProvider;
    }
  

  register = async(registerDto:RegisterDto) =>{
 
  const userExist = await this.userRepository.findByEmail(registerDto.email);
  if (userExist) throw userAlreadyExist;
 registerDto.password = await hashPassword(registerDto.password);
  const createdUser = await this.userRepository.create(registerDto);
  const code = generateOTPCode();

  await cacheProvider.set(`${this.sendOtpKey}${createdUser._id.toString()}`, code, toSeconds(3, 'minutes'));
  await this.mailProvider.send(registerDto.email, 'verification code', `<h1>Your verification code is ${code} </h1>`);
  return createdUser;
}

 verifyAccount=async(verifayAcountDto:VerifayAcountDto)=> {
  const user = await this.userRepository.findByEmail(verifayAcountDto.email);
  if (!user) throw userNotExist;
  if (user['isVerified'] === true) throw userAlreadyVerified;

  const cacheCode = await cacheProvider.get(`${this.sendOtpKey}${user._id.toString()}`);
  if (!cacheCode) throw otpExpired;
  if (cacheCode !== verifayAcountDto.code) throw invalidCode;
  const updatedUser = await this.userRepository.update({email:verifayAcountDto.email}, { isVerified: true });

  await cacheProvider.del(`${this.sendOtpKey}${user._id.toString()}`);

  return updatedUser;
}

 enable2StepVerification=async(enable2StepVerificationDto:Enable2StepVerificationDto)=> {
  const code = generateOTPCode();
  await cacheProvider.set(`${this.twoStepVerificationKey}${enable2StepVerificationDto.email}`, code, toSeconds(3, 'minutes'));
  await this.mailProvider.send(enable2StepVerificationDto.email, '2 step verification code', `your 2 step verification code is ${code}`);
}


 verifyCodeActiveTwoStepVerification=async(verifyCodeActiveTwoStepVerificationDto:VerifyCodeActiveTwoStepVerificationDto)=> {
  const user = await this.userRepository.findByEmail(verifyCodeActiveTwoStepVerificationDto.email);// {} | null
  if (!user) throw userNotExist;
  console.log(`${this.twoStepVerificationKey}${verifyCodeActiveTwoStepVerificationDto.email}`);

  
  const cacheCode = await cacheProvider.get(`${this.twoStepVerificationKey}${verifyCodeActiveTwoStepVerificationDto.email}`);
  console.log(cacheCode);

  if (!cacheCode) throw otpExpired;
  if (cacheCode !== verifyCodeActiveTwoStepVerificationDto.code) throw invalidCode;

  await this.userRepository.update({email:verifyCodeActiveTwoStepVerificationDto.email} ,{ twoStepVerification: true });
 
  await cacheProvider.del(`${this.twoStepVerificationKey}${verifyCodeActiveTwoStepVerificationDto.email}`);

}


 login=async(loginDto:LoginDto)=> {
  const cachedAttempt = await cacheProvider.get(`${loginDto.email}:login`);
  if (cachedAttempt === '0') throw new AppError('you reach max tries', 429);
  const user = await this.userRepository.findByEmail(loginDto.email);

  if (!user) throw userNotExist;
  if (user['isVerified'] === false) throw userNotVerified;
  const match = await comparePassword(loginDto.password, user['password']as string);
  if (!match) throw invalidPassword;

  if (user.twoStepVerification == true) {
    const code = generateOTPCode();
    await cacheProvider.set(`${this.twoStepVerificationKey}${loginDto.email}`, code, toSeconds(1, 'minutes'));
    await this.mailProvider.send(loginDto.email, '2 step verification code', `<h3>your code is ${code}</h3>`)
    return
  }

  const accessToken = generateAccessToken({ id: user._id, name: user.userName});
  const refreshToken = generateRefreshToken({ id: user._id, name: user.userName });

  const ttlRemaining = await cacheProvider.ttl(`${loginDto.email}:login`);
  const attempts = cachedAttempt ?? 5;
  const ttl = ttlRemaining === -2 ? toSeconds(3, 'minutes') : ttlRemaining;
  await cacheProvider.set(`${loginDto.email}:login`,String(+attempts - 1), ttl);

  return {
    accessToken, refreshToken
  }
}

 vverifyCodeTwoStepVerification=async(verifyCodeTwoStepVerificationDto:VverifyCodeTwoStepVerificationDto)=> {
  const user = await this.userRepository.findByEmail(verifyCodeTwoStepVerificationDto.email);
  if (!user) throw userNotExist;


  const cacheCode = await cacheProvider.get(`${this.twoStepVerificationKey}${verifyCodeTwoStepVerificationDto.email}`);

  if (!cacheCode) throw otpExpired;
  if (cacheCode !== verifyCodeTwoStepVerificationDto.code) throw invalidCode;

  const accessToken = generateAccessToken({ id: user._id, name: user.userName});
  const refreshToken = generateRefreshToken({ id: user._id, name: user.userName });

  await cacheProvider.del(`${this.twoStepVerificationKey}${verifyCodeTwoStepVerificationDto.email}`);

  return { accessToken, refreshToken };
}

sendOtp=async(sendOtpDto:SendOtpDto)=> {
  const user = await this.userRepository.findByEmail(sendOtpDto.email);
  if (!user) throw userNotExist;

  const code = generateOTPCode();

  await cacheProvider.set(`${this.sendOtpKey}${user._id.toString()}`, code, toSeconds(3, 'minutes'));
  await this.mailProvider.send(sendOtpDto.email, 'new otp', `<p>your new otp is ${code}</p>`);
}

resetPassword=async(resetPasswordDto:ResetPasswordDto&SendOtpDto)=> {
  const user = await this.userRepository.findByEmail(resetPasswordDto.email);
  if (!user) throw userNotExist;
  const otp = await cacheProvider.get(`${this.sendOtpKey}${user._id.toString()}`);
  if (!otp) throw otpExpired;
  if (otp !== resetPasswordDto.code) throw invalidCode;
  const hashedPassword = await hashPassword(resetPasswordDto.newPassword);
  await this.userRepository.update({email:resetPasswordDto.email}, { password: hashedPassword });

  await cacheProvider.del(`${this.sendOtpKey}${user._id.toString()}`)
}

 loginWithCGoogle=async(idToken:string)=> {
  const payload = await verifyGoogleToken(idToken);
if (!payload ) throw new AppError('Invalid Google token', 400);
    const user = await this.userRepository.findByEmail(payload.email as string);
  if (user) {
    return generateAccessToken({
      id: user._id,
      email: user.email,
    });
  }

  const createdUser = await this.userRepository.create({
    userName: payload.name as string ,
    email: payload.email as string ,
    provider: Provider.google,
    isVerified: true,
  });

  return generateAccessToken({
    id: createdUser._id,
    email: createdUser.email,
  });
}
 



 refreshTokenFn= async(token:string) =>{
  const isRevoked = await cacheProvider.get(`revoked:${token}`);
  if (isRevoked) throw new AppError('Token has been revoked', 401);
  const payload = Jwt.verify(token, env.jwt.refreshSecret) as TuserPayloud;
  await cacheProvider.set(`revoked:${token}`, '1', toSeconds(7, 'days'));
  const userId = payload.id || payload.sub;
  const userName = payload.name || payload.userName;
  const accessToken = generateAccessToken({ id: userId, name: userName });
  const refreshToken = generateRefreshToken({ id: userId, name: userName });
  return {
    accessToken, refreshToken
  }
}

 revokeToken = async (token: string) => {
  Jwt.verify(token, env.jwt.refreshSecret);
  await cacheProvider.set(`revoked:${token}`, '1', toSeconds(7, 'days'));
 }
}




