import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import * as bcrypt from "bcrypt";

//Schema
import { Wishlist, WishlistDocument } from "./model/wishlist.schema";
import { Movies, MoviesDocument } from "../movies/model/movies.schema";
import { User, UserDocument } from "../user/model/user.schema";

//Entity
import { SuccessInfo } from "../user/entities/success.entity";

//Dto
import { WishlistInput } from "./dto/wishlist.dto";
import { WatchlistInput } from "./dto/watchlist.dto";

//Types
import { ReqUser } from "../auth/types/user.types";

@Injectable()
export class WishlistService {
    //Constructor
    constructor(
        @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
        @InjectModel(Movies.name) private moviesModel: Model<MoviesDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    //Get Wishlist
    async getWishlist(reqUser: ReqUser) {
        const wishlist = await this.wishlistModel.find({
            user: reqUser._id
        }).sort({ _id: 1 });
        return wishlist;
    }

    //is Wish and Watch listed
    async isListed(name: string, reqUser: ReqUser) {
        const wishlist = await this.wishlistModel.findOne({
            name: name,
            user: reqUser._id
        });
        const watchlist = await this.moviesModel.findOne({
            name: name,
            user: reqUser._id
        });
        const obj = {
            name: name,
            isWishlisted: wishlist ? true : false,
            isWatchlisted: watchlist ? true : false
        }
        return obj;
    }

    //Add wishlist
    async add(wishlistInput: WishlistInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const movies = await this.moviesModel.findOne({
            name: wishlistInput.name,
            user: reqUser._id
        });
        if (movies) throw new NotFoundException("Movies already watched!");
        const wishlist = await this.wishlistModel.findOne({
            name: wishlistInput.name,
            user: reqUser._id
        });
        if (wishlist) throw new NotFoundException("Wishlist already added!");
        await this.wishlistModel.create({ ...wishlistInput, user: reqUser });
        return {
            success: true,
            message: "Wishlist added!"
        }
    }

    //Add to watched list
    async watched(watchlistInput: WatchlistInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const user = await this.userModel.findOne({
            _id: reqUser._id
        }).select("+code");
        const verifyCode = await bcrypt.compare(watchlistInput.code, user.code);
        if (!verifyCode) throw new NotFoundException("Wrong code!");
        const wishlist = await this.wishlistModel.findOneAndDelete({
            _id: watchlistInput.id,
            user: reqUser._id
        });
        if (!wishlist) throw new NotFoundException("Wishlist not found!");
        if (wishlist.mediaType === "movie") {
            await this.moviesModel.create({
                name: wishlist.name,
                releaseDate: wishlist.releaseDate,
                watchedDate: watchlistInput.watchedDate,
                poster: wishlist.poster,
                mediaType: wishlist.mediaType,
                user: reqUser._id
            });
        } else if (wishlist.mediaType === "tv") {
            await this.moviesModel.create({
                name: wishlist.name,
                releaseDate: wishlist.releaseDate,
                watchedDate: watchlistInput.watchedDate,
                poster: wishlist.poster,
                mediaType: wishlist.mediaType,
                user: reqUser._id,
                season: [watchlistInput.season]
            });
        }
        return {
            success: true,
            message: "Movies add to Watched list!"
        }
    }

    //Delete wishlist
    async delete(id: ObjectId, reqUser: ReqUser): Promise<SuccessInfo> {
        const result = await this.wishlistModel.findOneAndDelete({
            _id: id,
            user: reqUser._id
        });
        if (!result) throw new NotFoundException("Wishlist not found!");
        return {
            success: true,
            message: "Wishlist deleted!"
        }
    }
}