import { UseGuards } from "@nestjs/common";
import { Resolver, Mutation, Query, Args, Context, ID } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

//Service
import { WishlistService } from "./wishlist.service";

//Entity
import { SuccessInfo } from "../user/entities/success.entity";
import { Wishlist } from "./entities/wishlist.entity";
import { IsListed } from "./entities/is-listed.entity";

//Dto
import { WishlistInput } from "./dto/wishlist.dto";
import { WatchlistInput } from "./dto/watchlist.dto";

//Guards
import { Roles } from "../auth/decorator/auth.decorator";
import { Role } from "../auth/enum/auth.enum";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";

//Types
import { ReqUser } from "../auth/types/user.types";

@Resolver()
export class WishlistResolver {
    //Constructor
    constructor(
        private readonly wishlistService: WishlistService
    ) { }

    //Get Wishlist
    @Query(() => [Wishlist], { name: "getWishlist" })
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    getList(
        @Context("user") reqUser: ReqUser
    ) {
        return this.wishlistService.getWishlist(reqUser);
    }

    //Is listed
    @Query(() => IsListed, { name: "isListed" })
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    isListed(
        @Args("name") name: string,
        @Context("user") reqUser: ReqUser
    ) {
        return this.wishlistService.isListed(name, reqUser);
    }

    //Add wishlist
    @Mutation(() => SuccessInfo, { name: "addWishlist" })
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    add(
        @Args("wishlistInput") wishlistInput: WishlistInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.wishlistService.add(wishlistInput, reqUser);
    }

    //Add to watched list
    @Mutation(() => SuccessInfo, { name: "addToWatched" })
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    watched(
        @Args("watchlistInput") watchlistInput: WatchlistInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.wishlistService.watched(watchlistInput, reqUser);
    }

    //Delete Wishlist
    @Mutation(() => SuccessInfo, { name: "deleteWishlist" })
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id", { type: () => ID }) id: ObjectId,
        @Context("user") reqUser: ReqUser
    ) {
        return this.wishlistService.delete(id, reqUser);
    }
}