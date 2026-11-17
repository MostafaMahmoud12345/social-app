"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const abstract_repository_1 = require("../../../lib/abstract.repository/abstract.repository");
const user_model_1 = require("../model/user.model");
class UserRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(user_model_1.User);
    }
    async findByEmail(email) {
        return await user_model_1.User.findOne({ email: email });
    }
}
exports.UserRepository = UserRepository;
exports.default = new UserRepository();
