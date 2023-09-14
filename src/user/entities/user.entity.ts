import { ObjectType, Field, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

@ObjectType()
export class User {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: false })
    email: string;
    @Field(() => Boolean, { nullable: false })
    verified: boolean;
    @Field(() => String, { nullable: false })
    role: string;
    @Field(() => Date, { nullable: false })
    createdAt: Date;
    @Field(() => Date, { nullable: false })
    updatedAt: Date;
}