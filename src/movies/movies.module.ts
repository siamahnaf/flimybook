import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { MoviesService } from "./movies.service";
import { MoviesResolver } from "./movies.resolver";

//Schema
import { Movies, MoviesSchema } from "./model/movies.schema";

//User Module
import { UserModule } from "../user/user.module";
import { WishlistModule } from "src/wishlist/wishlist.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Movies.name,
            schema: MoviesSchema
        }]),
        UserModule,
        forwardRef(() => WishlistModule)
    ],
    providers: [MoviesService, MoviesResolver],
    exports: [MongooseModule]
})

export class MoviesModule { }