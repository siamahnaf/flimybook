import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class CodeInfo {
    @Field(() => Boolean, { nullable: false })
    success: boolean;
    @Field(() => String, { nullable: false })
    message: string;
    @Field(() => String, { nullable: false })
    verifiedId: string;
}