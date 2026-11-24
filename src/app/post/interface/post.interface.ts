import { Types } from "mongoose";

export interface IPost {
    content:string;
    userId:Types.ObjectId;
    commentCount:number;
    reactionCount:number;
    allowsComments:boolean;
}