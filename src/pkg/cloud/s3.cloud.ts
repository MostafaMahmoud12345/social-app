import { IcloudProvider } from "./cloud.interface";
import {DeleteObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { toSeconds } from "../utils/time";
interface s3config{
    region:string,
    accesskey:string,
    secretAccessKey:string,
    bucketName:string
}
export class S3CloudProvider implements IcloudProvider{
    private client:S3Client;
    private readonly bucketName;
    constructor(config:s3config){
        this.client= new S3Client({
            region:config.region,
            credentials:{
                accessKeyId:config.accesskey,
                secretAccessKey:config.secretAccessKey,
            }
        })
        this.bucketName=config.bucketName
    }
    async uploudFile(file:Express.Multer.File, path: string): Promise<string> {
        const command=new PutObjectCommand({
            Bucket:this.bucketName,
            Body:file.buffer,
            ContentType:file.mimetype,
            Key:`${path}/--${new Date().toISOString()}--${file.originalname}`

        })
        await this.client.send(command);
        return command.input.Key as string;
    }
    async generatePresigneUrl(file:Express.Multer.File,path:string):Promise<string>{
     const command=new PutObjectCommand({
            Bucket:this.bucketName,
            Key:`${path}/--${new Date().toISOString()}--${file.originalname}`,
            ContentType:file.mimetype,
    })
return getSignedUrl(this.client,command,{expiresIn:toSeconds(3,'minutes')})
}
   async deleteFile(key: string): Promise<void> {
  const command=new DeleteObjectCommand({
            Bucket:this.bucketName,
            Key:key
        })
        await this.client.send(command);
    }
    getFile(key: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
}