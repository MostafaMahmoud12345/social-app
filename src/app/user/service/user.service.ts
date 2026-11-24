import  userRepository, { UserRepository }  from './../repository/user.repository';
import { s3CloudProvider } from "../../../lib/cloud/init";
import { IcloudProvider } from "../../../pkg/cloud/cloud.interface";
import fs from 'node:fs'
import { User } from '../model/user.model';
import { AppError } from '../../../lib/error/error';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../lib/di/tokens';
@injectable()
 export class UserService{
   
 constructor(@inject(TOKENS.UserRepository)private readonly userRepository:UserRepository,
 @inject(TOKENS.CloudProvider)private readonly cloudProvider:IcloudProvider
){}
uploadProfilePicture=async(file:Express.Multer.File,userId:string)=>{
       file.buffer=fs.readFileSync(file.path)
     const key=  await this.cloudProvider.uploudFile(file,`users/${userId}`)
await this.userRepository.update({_id:userId},{profilePicturePath:key})
    }
    generatePresigneUrl=async(file:Partial<Express.Multer.File>,userId:string)=>{
        return await this.cloudProvider.generatePresigneUrl(file,`users/${userId}`)
    }
    deletProfilePicture=async(userId:string)=>{
        const user = await this.userRepository.getOne({_id:userId});
        if(!user?.profilePicturePath){throw new AppError('profile picture not found',404)}
        await this.cloudProvider.deleteFile(user.profilePicturePath)
        await this.userRepository.update({_id:userId},{$unset:{profilePicturePath:''}})
    }
    
}
