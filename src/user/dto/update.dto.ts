import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export class UpdateInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;
}
