import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty } from "class-validator";

@InputType()
export class CodeInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    code: string;
}