
import { TuserPayloud } from './userPayloud.type';

declare module 'express-serve-static-core'{
    interface Request{
        user?:TuserPayloud
    }
}