import { UseGuards } from "@nestjs/common";
import { Resolver, Mutation, Query, Args, Context } from "@nestjs/graphql";

//Service
import { MoviesService } from "./movies.service";

//Entity
import { SuccessInfo } from "../user/entities/success.entity";
import { GetMovies } from "./entities/movies.entity";

//Dto
import { MoviesInput } from "./dto/movies.dto";
import { DeleteInput } from "./dto/delete.dto";
import { GetMoviesInput } from "./dto/get-movies.dto";

//Guards
import { Roles } from "../auth/decorator/auth.decorator";
import { Role } from "../auth/enum/auth.enum";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";

//Types
import { ReqUser } from "../auth/types/user.types";

@Resolver()
export class MoviesResolver {
    //Constructor
    constructor(
        private readonly moviesService: MoviesService
    ) { };

    //Get Movies
    @Query(() => GetMovies, { name: "getMovies" })
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    getMovies(
        @Args("getMoviesInput") getMoviesInput: GetMoviesInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.moviesService.getMovies(getMoviesInput, reqUser);
    }

    //Add Movies
    @Mutation(() => SuccessInfo, { name: "addMovies" })
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    add(
        @Args("moviesInput") moviesInput: MoviesInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.moviesService.add(moviesInput, reqUser);
    }

    //Delete Movies
    @Mutation(() => SuccessInfo, { name: "deleteMovies" })
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("deleteInput") deleteInput: DeleteInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.moviesService.delete(deleteInput, reqUser);
    }
}