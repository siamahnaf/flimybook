import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class SignupInput {
    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    password: string;

    @Field(() => String, { nullable: false })
    @IsNotEmpty()
    @IsString()
    code: string;
}