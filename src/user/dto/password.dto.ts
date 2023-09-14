import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export class PasswordInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    newPassword: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    code: string;
}