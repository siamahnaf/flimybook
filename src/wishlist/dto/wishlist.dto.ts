import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty } from "class-validator";

@InputType()
export class WishlistInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    releaseDate: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsNotEmpty()
    poster: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsNotEmpty()
    mediaType: string;
}