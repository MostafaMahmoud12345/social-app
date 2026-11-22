"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = __importDefault(require("./../repository/user.repository"));
const init_1 = require("../../../lib/cloud/init");
const node_fs_1 = __importDefault(require("node:fs"));
const error_1 = require("../../../lib/error/error");
class UserService {
    cloudProvider = init_1.s3CloudProvider;
    userRepository = user_repository_1.default;
    uploadProfilePicture = async (file, userId) => {
        file.buffer = node_fs_1.default.readFileSync(file.path);
        const key = await this.cloudProvider.uploudFile(file, `users/${userId}`);
        await this.userRepository.update({ _id: userId }, { profilePicturePath: key });
    };
    generatePresigneUrl = async (file, userId) => {
        return await this.cloudProvider.generatePresigneUrl(file, `users/${userId}`);
    };
    deletProfilePicture = async (userId) => {
        const user = await this.userRepository.getOne({ _id: userId });
        if (!user?.profilePicturePath) {
            throw new error_1.AppError('profile picture not found', 404);
        }
        await this.cloudProvider.deleteFile(user.profilePicturePath);
        await this.userRepository.update({ _id: userId }, { $unset: { profilePicturePath: '' } });
    };
}
exports.default = new UserService();
