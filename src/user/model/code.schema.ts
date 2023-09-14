import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

//User Schema
import { User } from "./user.schema";

export type CodeDocument = Code & Document;

@Schema({ timestamps: true })
export class Code {
    @Prop({ type: String, required: true })
    code: string;
    @Prop({ type: Types.ObjectId, ref: "User" })
    user: User;
}

export const CodeSchema = SchemaFactory.createForClass(Code);