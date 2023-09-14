import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";

//Schema and Model
import { User, UserDocument } from "../user/model/user.schema";

@Injectable()
export class AuthGuard implements CanActivate {
    //Constructor
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService
    ) { };

    //Execution
    async canActivate(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context).getContext();
        const cookies = await this.cookieParser(ctx.req.headers.cookie);
        if (!cookies["id"]) {
            return false;
        }
        ctx.user = await this.validToken(cookies["id"]);
        return true;
    }
    async validToken(cooke: string) {
        try {
            const decode = this.jwtService.verify(cooke);
            const user = await this.userModel.findOne({
                email: decode.email
            });
            if (!user || !user.verified) throw new HttpException("Unauthorized Request", HttpStatus.UNAUTHORIZED);
            return user;
        } catch (err) {
            throw new HttpException("Unauthorized Request", HttpStatus.UNAUTHORIZED);
        }
    }

    //Cookie Parser
    private async cookieParser(cookieHeader: string): Promise<{ [key: string]: string }> {
        const cookies: { [key: string]: string } = {};
        if (cookieHeader) {
            const cookiePairs = cookieHeader.split(';');
            for (const cookiePair of cookiePairs) {
                const [name, value] = cookiePair.split('=').map((part) => part.trim());
                cookies[name] = value;
            }
        }
        return cookies;
    }
}