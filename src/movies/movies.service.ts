import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import * as bcrypt from "bcrypt";

//Schema
import { Movies, MoviesDocument } from "./model/movies.schema";
import { Code, CodeDocument } from "../user/model/code.schema";
import { User, UserDocument } from "../user/model/user.schema";
import { Wishlist, WishlistDocument } from "../wishlist/model/wishlist.schema";

//Entity
import { SuccessInfo } from "../user/entities/success.entity";

//Dto
import { MoviesInput } from "./dto/movies.dto";
import { DeleteInput } from "./dto/delete.dto";
import { GetMoviesInput } from "./dto/get-movies.dto";

//Types
import { ReqUser } from "../auth/types/user.types";

//Args Types
type Args = {
    name?: {
        $regex?: string;
        $options?: string;
    };
    _id?: {
        $lt?: ObjectId
    };
    args?: ObjectId;
}

@Injectable()
export class MoviesService {
    //Constructor
    constructor(
        @InjectModel(Movies.name) private moviesModel: Model<MoviesDocument>,
        @InjectModel(Code.name) private codeModel: Model<CodeDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Wishlist.name) private wishlitModel: Model<WishlistDocument>
    ) { }

    //Get Movies
    async getMovies(getMoviesInput: GetMoviesInput, reqUser: ReqUser) {
        let args: Args = {};
        if (getMoviesInput.search) {
            args["name"] = {
                $regex: getMoviesInput.search,
                $options: 'i'
            }
        }
        if (getMoviesInput.cursor) {
            args["_id"] = {
                $lt: getMoviesInput.cursor
            }
        }
        args["user"] = reqUser._id
        const limit = getMoviesInput.limit || 10
        let movies = await this.moviesModel.find(args).sort({ _id: -1 }).limit(limit + 1);
        const hasNextPage = movies.length > limit;
        movies = hasNextPage ? movies.slice(0, -1) : movies;
        const count = await this.moviesModel.countDocuments({
            user: reqUser._id
        })
        return {
            success: true,
            movies,
            pageInfos: {
                cursor: hasNextPage ? movies[movies.length - 1].id : null,
                hasNextPage,
                count
            }
        }
    }

    //Add Movies
    async add(moviesInput: MoviesInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const code = await this.codeModel.findOne({
            user: reqUser._id
        });
        if (!code || code?.code !== moviesInput.verifiedId) throw new NotFoundException("Please verify it's you!");
        if (moviesInput.mediaType === "movie") {
            const movies = await this.moviesModel.findOne({
                name: moviesInput.name,
                user: reqUser._id
            });
            if (movies) throw new NotFoundException("Movies already watched!");
            await this.moviesModel.create({
                name: moviesInput.name,
                releaseDate: moviesInput.releaseDate,
                watchedDate: moviesInput.watchedDate,
                poster: moviesInput.poster,
                mediaType: moviesInput.mediaType,
                user: reqUser._id
            });
        } else if (moviesInput.mediaType === "tv") {
            const movies = await this.moviesModel.findOne({
                name: moviesInput.name,
                user: reqUser._id,
            });
            if (movies) {
                if (movies.season?.includes(moviesInput.season)) throw new NotFoundException("Season already watched!")
                await this.moviesModel.findByIdAndUpdate(movies._id, {
                    $push: {
                        season: moviesInput.season
                    }
                }, { new: true })
            } else {
                await this.moviesModel.create({ ...moviesInput, season: [moviesInput.season], user: reqUser._id });
            }
        }
        await this.wishlitModel.findOneAndDelete({
            name: moviesInput.name,
            user: reqUser._id
        });
        return {
            success: true,
            message: `${moviesInput.mediaType[0].toUpperCase() + moviesInput.mediaType.slice(1)} added successfully!`
        }
    }

    //Delete movies
    async delete(deleteInput: DeleteInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const user = await this.userModel.findOne({
            _id: reqUser._id
        }).select("+code");
        const verifyCode = await bcrypt.compare(deleteInput.code, user.code);
        if (!verifyCode) throw new NotFoundException("Wrong code!");
        await this.moviesModel.findOneAndDelete({
            _id: deleteInput.id,
            user: reqUser._id
        });
        return {
            success: true,
            message: "Movies deleted successfully!"
        }
    }
}