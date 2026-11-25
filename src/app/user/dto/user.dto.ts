import { Gender } from "../../auth/enum/enum";

export interface UpdateProfileDto {
    userName?: string;
    bio?: string;
    phoneNumber?: string;
    gender?: Gender;
}

export interface UpdatePrivacyDto {
    isPrivate: boolean;
}
