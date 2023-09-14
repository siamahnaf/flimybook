import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

//Service and Resolver
import { BookService } from "./books.service";
import { BookResolver } from "./books.resolver";

//Schema
import { Book, BookSchema } from "./model/book.schema";

//Module
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Book.name,
            schema: BookSchema
        }]),
        UserModule
    ],
    providers: [BookService, BookResolver],
    exports: [MongooseModule]
})

export class BookModule { }