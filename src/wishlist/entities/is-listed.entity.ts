import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class IsListed {
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => Boolean, { nullable: false })
    isWishlisted: boolean;
    @Field(() => Boolean, { nullable: false })
    isWatchlisted: boolean;
}