import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export class BooksInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    writer: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    date: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    verifiedId: string;
}