import { HydratedDocument, Schema, Types, model } from 'mongoose';
import { Gender, Provider } from '../../auth/enum/enum';
import { Iuser } from '../interface/user.interface';

export type userDocument = HydratedDocument<Iuser>;

const schema = new Schema<Iuser>(
    {
        userName: { type: String, required: true, trim: true, minlength: 3, maxLength: 30 },
        email: { type: String, required: true, trim: true, minlength: 3, toLowerCase: true },
        password: { type: String, required: function () { return this.provider === Provider.local; }, trim: true },
        provider: { type: Number, default: Provider.local, enum: Provider },
        gender: { type: Number, default: Gender.male, enum: Gender },
        profilePicturePath: { type: String },
        bio: { type: String, trim: true, maxlength: 200 },
        phoneNumber: { type: String, trim: true },
        isPrivate: { type: Boolean, default: false },
        followers: [{ type: Types.ObjectId, ref: 'User' }],
        following: [{ type: Types.ObjectId, ref: 'User' }],
        followRequests: [{ type: Types.ObjectId, ref: 'User' }],
        isVerified: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        twoStepVerification: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const User = model<Iuser>('User', schema);
