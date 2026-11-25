"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const enum_1 = require("../../auth/enum/enum");
const schema = new mongoose_1.Schema({
    userName: { type: String, required: true, trim: true, minlength: 3, maxLength: 30 },
    email: { type: String, required: true, trim: true, minlength: 3, toLowerCase: true },
    password: { type: String, required: function () { return this.provider === enum_1.Provider.local; }, trim: true },
    provider: { type: Number, default: enum_1.Provider.local, enum: enum_1.Provider },
    gender: { type: Number, default: enum_1.Gender.male, enum: enum_1.Gender },
    profilePicturePath: { type: String },
    bio: { type: String, trim: true, maxlength: 200 },
    phoneNumber: { type: String, trim: true },
    isPrivate: { type: Boolean, default: false },
    followers: [{ type: mongoose_1.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose_1.Types.ObjectId, ref: 'User' }],
    followRequests: [{ type: mongoose_1.Types.ObjectId, ref: 'User' }],
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    twoStepVerification: { type: Boolean, default: false },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', schema);
