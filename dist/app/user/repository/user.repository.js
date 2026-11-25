"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_model_1 = require("../model/user.model");
const abstract_repository_1 = require("../../../lib/abstract.repository/abstract.repository");
class UserRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(user_model_1.User);
    }
    async findByEmail(email) {
        return await user_model_1.User.findOne({ email });
    }
    async findByIdSafe(id) {
        return await user_model_1.User.findOne({ _id: id, isDeleted: false }).select("-password");
    }
    async searchUsers(query, currentUserId) {
        return await user_model_1.User.find({
            _id: { $ne: currentUserId },
            isDeleted: false,
            $or: [
                { userName: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
            ],
        })
            .select("userName profilePicturePath bio isPrivate")
            .limit(20);
    }
    async getSuggestions(currentUserId, followingIds) {
        return await user_model_1.User.find({
            _id: { $nin: [currentUserId, ...followingIds] },
            isDeleted: false,
        })
            .select("userName profilePicturePath bio isPrivate")
            .limit(10);
    }
    async getPopulatedFollowers(userId) {
        return await user_model_1.User.findById(userId)
            .select("followers")
            .populate("followers", "userName profilePicturePath bio");
    }
    async getPopulatedFollowing(userId) {
        return await user_model_1.User.findById(userId)
            .select("following")
            .populate("following", "userName profilePicturePath bio");
    }
}
exports.UserRepository = UserRepository;
exports.default = new UserRepository();
