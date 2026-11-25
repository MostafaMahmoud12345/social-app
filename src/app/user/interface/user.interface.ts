import { Types } from "mongoose";
import { Gender, Provider } from "../../auth/enum/enum";

export interface Iuser {
    userName: string;
    email: string;
    password?: string;
    provider?: Provider;
    gender?: Gender;
    profilePicturePath?: string;
    bio?: string;
    phoneNumber?: string;
    isPrivate?: boolean;
    followers?: Types.ObjectId[];
    following?: Types.ObjectId[];
    followRequests?: Types.ObjectId[];
    isVerified?: boolean;
    isDeleted?: boolean;
    twoStepVerification?: boolean;
}
