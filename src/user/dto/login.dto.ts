import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsEmail } from "class-validator";

@InputType()
export class LoginInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    password: string;
}