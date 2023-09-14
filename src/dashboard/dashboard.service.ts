import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

//Schema
import { BookDocument, Book } from "src/books/model/book.schema";
import { MoviesDocument, Movies } from "src/movies/model/movies.schema";

//Types
import { ReqUser } from "../auth/types/user.types";

@Injectable()
export class DashboardService {
    //Constructor
    constructor(
        @InjectModel(Movies.name) private moviesModel: Model<MoviesDocument>,
        @InjectModel(Book.name) private bookModel: Model<BookDocument>
    ) { };

    //Get dashboard
    async gets(reqUser: ReqUser) {
        const totalMovies = await this.moviesModel.countDocuments({
            user: reqUser._id
        });
        const totalBooks = await this.bookModel.countDocuments({
            user: reqUser._id
        });
        return {
            totalMovies,
            totalBooks
        }
    }
}