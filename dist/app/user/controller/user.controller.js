"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../service/user.service"));
class UserController {
    userService = user_service_1.default;
    uploadProfilePicture = async (req, res, next) => {
        try {
            await this.userService.uploadProfilePicture(req.file, '6afe11b2307d7b482c2abce7');
            res.json({ message: "ProfilePicture upload successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
    generatePresigneUrl = async (req, res, next) => {
        try {
            const { fileName, contentType } = req.body;
            const url = await this.userService.generatePresigneUrl({ mimetype: contentType, originalname: fileName }, '6afe11b2307d7b482c2abce7');
            res.json({ message: "ok", success: true, data: { url } });
        }
        catch (error) {
            next(error);
        }
    };
    deletProfilePicture = async (req, res, next) => {
        try {
            await this.userService.deletProfilePicture('6afe11b2307d7b482c2abce7');
            res.json({ message: "ProfilePicture delete successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new UserController();
