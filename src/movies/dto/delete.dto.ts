import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class DeleteInput {
    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    id: ObjectId;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    code: string;
}