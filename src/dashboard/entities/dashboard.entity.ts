import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class Dashboard {
    @Field(() => String, { nullable: false })
    totalMovies: string;
    @Field(() => String, { nullable: false })
    totalBooks: string;
}