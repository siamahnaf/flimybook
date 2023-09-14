import { ObjectType, Field, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//PageInfos
import { PageInfos } from "../../movies/entities/movies.entity";

@ObjectType()
export class Books {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: true })
    writer: string;
    @Field(() => String, { nullable: true })
    date: string;
    @Field(() => Date, { nullable: false })
    createdAt: Date;
    @Field(() => Date, { nullable: false })
    updatedAt: Date;
}

@ObjectType()
export class GetBooks {
    @Field(() => Boolean, { nullable: false })
    success: boolean;
    @Field(() => [Books], { nullable: true })
    books: [Books];
    @Field(() => PageInfos, { nullable: true })
    pageInfos: PageInfos;
}