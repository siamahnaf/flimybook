import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, required: true })
    email: string;
    @Prop({ type: String, required: true, select: false })
    password: string;
    @Prop({ type: String, required: true, select: false })
    code: string;
    @Prop({ type: String, select: false })
    otp: string;
    @Prop({ type: Boolean, required: true, default: false })
    verified: boolean;
    @Prop({ type: String })
    verifiedId: string;
    @Prop({ type: String, required: true, enum: ["user", "admin"], default: "user" })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 300,
    partialFilterExpression: {
        verified: false
    }
});