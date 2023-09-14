import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsEmail, IsNotEmpty } from "class-validator";

@InputType()
export class ForgetInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
}