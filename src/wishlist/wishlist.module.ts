import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { WishlistService } from "./wishlist.service";
import { WishlistResolver } from "./wishlist.resolver";

//Schema
import { Wishlist, WishlistSchema } from "./model/wishlist.schema";

//Module
import { UserModule } from "../user/user.module";
import { MoviesModule } from "../movies/movies.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Wishlist.name,
            schema: WishlistSchema
        }]),
        UserModule,
        MoviesModule
    ],
    providers: [WishlistService, WishlistResolver],
    exports: [MongooseModule]
})

export class WishlistModule { }