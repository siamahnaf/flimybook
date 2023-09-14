//Packages
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

//User service and Resolver
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";

//Schema
import { User, UserSchema } from "./model/user.schema";
import { Code, CodeSchema } from "./model/code.schema";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            },
            {
                name: Code.name,
                schema: CodeSchema
            }
        ]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: "90day" }
        })
    ],
    providers: [UserService, UserResolver],
    exports: [MongooseModule, JwtModule]
})

export class UserModule { }