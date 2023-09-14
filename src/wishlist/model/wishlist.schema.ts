import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

//User
import { User } from "../../user/model/user.schema";

export type WishlistDocument = Wishlist & Document;

@Schema({ timestamps: true })
export class Wishlist {
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String })
    releaseDate: string;
    @Prop({ type: String })
    poster: string;
    @Prop({ type: String })
    mediaType: string;
    @Prop({ type: Types.ObjectId, ref: "User" })
    user: User;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);