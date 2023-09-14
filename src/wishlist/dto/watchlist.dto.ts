import { InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";

@InputType()
export class WatchlistInput {
    @Field(() => ID, { nullable: false })
    @IsString()
    @IsNotEmpty()
    id: ObjectId;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    season: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    watchedDate: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    code: string;
}