import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsEmail } from "class-validator";

@InputType()
export class NewPasswordInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    code: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    password: string;
}