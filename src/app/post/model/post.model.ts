import { model, Schema, Types } from "mongoose";
import { IPost } from "../interface/post.interface";

const schema = new Schema<IPost>({
    content:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        maxlength:300
    },
    userId:{
        type:Types.ObjectId,
        ref:'User',
        requird:true
    },
    commentCount:{
        type:Number,
        default:0
    },
   reactionCount:{
        type:Number,
        default:0
    } 
})
export const Post = model('Post',schema)