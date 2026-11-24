import multer from "multer" 
export interface IcloudProvider{
    uploudFile(file:Express.Multer.File,path:string):Promise<string>,
    deleteFile(key:string):Promise<void>,
    getFile(key:string):Promise<Buffer>,
    generatePresigneUrl(file:Partial<Express.Multer.File>,path:string):Promise<string>,

}