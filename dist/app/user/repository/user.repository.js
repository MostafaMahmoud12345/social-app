import { AbstractRepository } from "../../../lib/abstract.repository/abstract.repository";
import { User } from "../model/user.model";
export class UserRepository extends AbstractRepository {
    constructor() {
        super(User);
    }
    async findByEmail(email) {
        return await User.findOne({ email: email });
    }
}
export default new UserRepository();
