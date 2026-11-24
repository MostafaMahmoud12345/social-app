import { NextFunction,Request,Response } from "express";
import {UserService} from "../service/user.service";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/tokens";
@injectable()
 export class UserController{
    constructor(@inject(TOKENS.UserService)private readonly userService:UserService
){}
    uploadProfilePicture=async(req:Request,res:Response,next:NextFunction)=>{
        try{
await this.userService.uploadProfilePicture(req.file as Express.Multer.File,'6afe11b2307d7b482c2abce7')
res.json({message:"ProfilePicture upload successfully",success:true})
        }catch(error){
            next(error)
        }
    }
    generatePresigneUrl=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const{fileName,contentType}=req.body
 const url=await this.userService.generatePresigneUrl({mimetype:contentType,originalname:fileName},'6afe11b2307d7b482c2abce7');
res.json({message:"ok",success:true,data:{url}})
        }catch(error){
            next(error)
        }
    }
    deletProfilePicture=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            await this.userService.deletProfilePicture('6afe11b2307d7b482c2abce7')
            res.json({message:"ProfilePicture delete successfully",success:true})
        } catch (error) {
            next(error)
        }
    }
}
