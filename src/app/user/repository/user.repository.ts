import { userDocument } from './../model/user.model';
import {AbstractRepository} from "../../../lib/abstract.repository/abstract.repository"
import { Iuser } from "../interface/user.interface";
import { User } from "../model/user.model";

 export class UserRepository extends AbstractRepository<Iuser> {
    constructor(){
        super(User)
    }
    async findByEmail(email:string):Promise < userDocument | null>{
        return await User.findOne({email:email})
    }
}
export default new UserRepository()