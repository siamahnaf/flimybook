import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

//User
import { User } from "../../user/model/user.schema";

export type BookDocument = Book & Document;

@Schema({ timestamps: true })
export class Book {
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, required: true })
    writer: string;
    @Prop({ type: String })
    date: string;
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    user: User;
}

export const BookSchema = SchemaFactory.createForClass(Book);