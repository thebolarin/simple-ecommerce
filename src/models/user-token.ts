import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface UserTokenAttrs {
    userId: string;
    token: string;
}

interface UserTokenDoc extends mongoose.Document {
    userId: string;
    token: string;
}

interface UserTokenModel extends mongoose.Model<UserTokenDoc> {
    build(attrs: UserTokenAttrs): UserTokenDoc;
}

const userTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 30 * 86400 //30 days
        }
    },
    { timestamps: true }
);

userTokenSchema.set('versionKey', 'version');
userTokenSchema.plugin(updateIfCurrentPlugin);

userTokenSchema.statics.build = (attrs: UserTokenAttrs) => {
    return new UserToken(attrs);
};

const UserToken = mongoose.model<UserTokenDoc, UserTokenModel>('UserToken', userTokenSchema);

export { UserToken };