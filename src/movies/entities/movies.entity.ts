import { ObjectType, Field, Int, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

@ObjectType()
export class Movies {
    @Field(() => ID, { nullable: false })
    id: ObjectId;
    @Field(() => String, { nullable: false })
    name: string;
    @Field(() => String, { nullable: true })
    releaseDate: string;
    @Field(() => String, { nullable: true })
    watchedDate: string;
    @Field(() => String, { nullable: true })
    poster: string;
    @Field(() => String, { nullable: true })
    mediaType: string;
    @Field(() => [String], { nullable: true })
    season: string[];
    @Field(() => Date, { nullable: false })
    createdAt: Date;
    @Field(() => Date, { nullable: false })
    updatedAt: Date;
}

@ObjectType()
export class PageInfos {
    @Field(() => ID, { nullable: true })
    cursor: ObjectId;
    @Field(() => Boolean, { nullable: true })
    hasNextPage: boolean;
    @Field(() => Int, { nullable: false })
    count: number;
}

@ObjectType()
export class GetMovies {
    @Field(() => Boolean, { nullable: false })
    success: boolean;
    @Field(() => [Movies], { nullable: true })
    movies: [Movies];
    @Field(() => PageInfos, { nullable: true })
    pageInfos: PageInfos
}