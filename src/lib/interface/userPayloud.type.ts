import{ JwtPayload } from "jsonwebtoken";
import { Iuser } from "../../app/user/interface/user.interface";
export type TuserPayloud =JwtPayload&Partial<Iuser>;