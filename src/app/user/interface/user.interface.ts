import { Gender,Provider } from "../../auth/enum/enum"
 export interface Iuser{
    userName:string,
    email:string,
    password?:string,
    provider?:Provider,
    gender?:Gender,
    profilePicturePath?:string,
    isVerified?:boolean,
    isDeleted?:boolean,
    twoStepVerification?:boolean
}