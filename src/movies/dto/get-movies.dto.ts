import { InputType, Field, ID, Int } from "@nestjs/graphql";
import { IsString, IsNumber, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class GetMoviesInput {
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