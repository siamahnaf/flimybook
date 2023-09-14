import { ObjectType, Field, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

@ObjectType()
export class Wishlist {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: true })
    releaseDate: string;
    @Field(() => String, { nullable: true })
    poster: string;
    @Field(() => String, { nullable: true })
    mediaType: string;
    @Field(() => Date, { nullable: false })
    createdAt: Date;
    @Field(() => Date, { nullable: false })
    updatedAt: Date;
}