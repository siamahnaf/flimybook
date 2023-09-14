import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import * as bcrypt from "bcrypt";

//Schema
import { Book, BookDocument } from "./model/book.schema";
import { Code, CodeDocument } from "../user/model/code.schema";
import { User, UserDocument } from "../user/model/user.schema";

//Entity
import { SuccessInfo } from "../user/entities/success.entity";

//Dto
import { BooksInput } from "./dto/books.dto";
import { DeleteInput } from "../movies/dto/delete.dto";
import { GetBooksInput } from "./dto/get-book.dto";

//Types
import { ReqUser } from "../auth/types/user.types";

//Types
type Args = {
    name?: {
        $regex?: string;
        $options?: string;
    };
    _id?: {
        $lt?: ObjectId
    };
    user?: ObjectId;
}

@Injectable()
export class BookService {
    //Constructor
    constructor(
        @InjectModel(Book.name) private bookModel: Model<BookDocument>,
        @InjectModel(Code.name) private codeModel: Model<CodeDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    //Get Books
    async getBooks(getBooksInput: GetBooksInput, reqUser: ReqUser) {
        let args: Args = {};
        if (getBooksInput.search) {
            args["name"] = {
                $regex: getBooksInput.search,
                $options: 'i'
            }
        }
        if (getBooksInput.cursor) {
            args['_id'] = {
                $lt: getBooksInput.cursor
            }
        }
        args["user"] = reqUser._id;
        const limit = getBooksInput.limit;
        let books = await this.bookModel.find(args).sort({ _id: -1 }).limit(limit + 1);
        const hasNextPage = books.length > limit;
        books = hasNextPage ? books.slice(0, -1) : books;
        const count = await this.bookModel.countDocuments({
            user: reqUser._id
        })
        return {
            success: true,
            books,
            pageInfos: {
                cursor: hasNextPage ? books[books.length - 1].id : null,
                hasNextPage,
                count
            }
        }
    }

    //Add books
    async add(booksInput: BooksInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const code = await this.codeModel.findOne({
            user: reqUser._id
        });
        if (!code || code?.code !== booksInput.verifiedId) throw new NotFoundException("Please give your security code again!");
        const movies = await this.bookModel.findOne({
            name: booksInput.name,
            user: reqUser._id,
            writer: booksInput.writer
        });
        if (movies) throw new NotFoundException("Book already read!")
        await this.bookModel.create({ ...booksInput, user: reqUser._id });
        return {
            success: true,
            message: "Book added successfully!"
        }
    }

    //Delete Books
    async delete(deleteInput: DeleteInput, reqUser: ReqUser) {
        const user = await this.userModel.findOne({
            _id: reqUser._id
        }).select("+code");
        const verifyCode = await bcrypt.compare(deleteInput.code, user.code);
        if (!verifyCode) throw new NotFoundException("Wrong code!");
        await this.bookModel.findOneAndDelete({
            _id: deleteInput.id,
            user: reqUser._id
        });
        return {
            success: true,
            message: "Book deleted successfully!"
        }
    }
}