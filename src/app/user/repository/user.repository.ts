import { Types } from "mongoose";
import { userDocument, User } from "../model/user.model";
import { AbstractRepository } from "../../../lib/abstract.repository/abstract.repository";
import { Iuser } from "../interface/user.interface";

export class UserRepository extends AbstractRepository<Iuser> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<userDocument | null> {
        return await User.findOne({ email });
    }

    async findByIdSafe(id: string): Promise<userDocument | null> {
        return await User.findOne({ _id: id, isDeleted: false }).select("-password");
    }

    async searchUsers(query: string, currentUserId: string): Promise<userDocument[]> {
        return await User.find({
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

    async getSuggestions(currentUserId: string, followingIds: Types.ObjectId[]): Promise<userDocument[]> {
        return await User.find({
            _id: { $nin: [currentUserId, ...followingIds] },
            isDeleted: false,
        })
            .select("userName profilePicturePath bio isPrivate")
            .limit(10);
    }

    async getPopulatedFollowers(userId: string) {
        return await User.findById(userId)
            .select("followers")
            .populate("followers", "userName profilePicturePath bio");
    }

    async getPopulatedFollowing(userId: string) {
        return await User.findById(userId)
            .select("following")
            .populate("following", "userName profilePicturePath bio");
    }
}

export default new UserRepository();
