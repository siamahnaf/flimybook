import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";


@InputType()
export class MoviesInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    releaseDate: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    watchedDate: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsNotEmpty()
    poster: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsNotEmpty()
    mediaType: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    season: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    verifiedId: string;
}