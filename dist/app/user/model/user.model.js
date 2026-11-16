import { Schema, model } from 'mongoose';
import { Gender, Provider } from '../../auth/enum/enum';
const schema = new Schema({
    userName: { type: String, required: true, trim: true, minlength: 3, maxLength: 30 },
    email: { type: String, required: true, trim: true, minlength: 3, toLowerCase: true },
    password: { type: String, required: function () { return this.provider === Provider.local; }, trim: true },
    provider: { type: Number, default: Provider.local, enum: Provider },
    gender: { type: Number, default: Gender.male, enum: Gender },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    twoStepVerification: { type: Boolean, default: false },
});
export const User = model('User', schema);
