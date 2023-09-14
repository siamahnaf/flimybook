import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

//User Schema
import { User } from "../../user/model/user.schema";

export type MoviesDocument = Movies & Document;

@Schema({ timestamps: true })
export class Movies {
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String })
    releaseDate: string
    @Prop({ type: String })
    watchedDate: string
    @Prop({ type: String })
    poster: string;
    @Prop({ type: String })
    mediaType: string;
    @Prop({ type: [String], default: undefined })
    season: string[];
    @Prop({ type: Types.ObjectId, ref: "User" })
    user: User;
}

export const MoviesSchema = SchemaFactory.createForClass(Movies);