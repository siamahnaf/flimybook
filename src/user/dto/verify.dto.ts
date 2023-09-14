import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";

@InputType()
export class VerifyInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    otp: string;
}