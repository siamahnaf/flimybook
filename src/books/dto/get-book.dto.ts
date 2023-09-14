import { InputType, Field, Int, ID } from "@nestjs/graphql";
import { IsString, IsOptional, IsNumber } from "class-validator";
import { ObjectId } from "mongoose";


@InputType()
export class GetBooksInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    search: string;

    @Field(() => ID, { nullable: true })
    @IsString()
    @IsOptional()
    cursor: ObjectId;

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @IsOptional()
    limit: number;
}