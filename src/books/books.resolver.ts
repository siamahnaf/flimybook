import { UseGuards } from "@nestjs/common";
import { Resolver, Mutation, Query, Args, Context } from "@nestjs/graphql";

//Service
import { BookService } from "./books.service";

//Entity
import { SuccessInfo } from "../user/entities/success.entity";
import { GetBooks } from "./entities/books.entity";

//Dto
import { BooksInput } from "./dto/books.dto";
import { DeleteInput } from "../movies/dto/delete.dto";
import { GetBooksInput } from "./dto/get-book.dto";

//Guards
import { Roles } from "../auth/decorator/auth.decorator";
import { Role } from "../auth/enum/auth.enum";
import { RolesGuard } from "../auth/roles.guard";
import { AuthGuard } from "../auth/auth.guard";

//Types
import { ReqUser } from "../auth/types/user.types";

@Resolver()
export class BookResolver {
    //Constructor
    constructor(private readonly bookService: BookService) { }

    //Get Books
    @Query(() => GetBooks, { name: "getBooks" })
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    getBook(
        @Args("getBooksInput") getBooksInput: GetBooksInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.bookService.getBooks(getBooksInput, reqUser);
    }

    //Add books
    @Mutation(() => SuccessInfo, { name: "addBooks" })
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    async add(
        @Args("booksInput") booksInput: BooksInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.bookService.add(booksInput, reqUser);
    }

    //Delete Books
    @Mutation(() => SuccessInfo, { name: "deleteBook" })
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("deleteInput") deleteInput: DeleteInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.bookService.delete(deleteInput, reqUser);
    }
}