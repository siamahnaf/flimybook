import { UseGuards } from "@nestjs/common";
import { Resolver, Mutation, Query, Args, Context } from "@nestjs/graphql";

//Service
import { UserService } from "./user.service";

//Entity
import { SuccessInfo } from "./entities/success.entity";
import { User } from "./entities/user.entity";
import { CodeInfo } from "./entities/code.entity";
import { RegistrationInfo } from "./entities/registration.entity";

//Dto
import { SignupInput } from "./dto/signup.dto";
import { VerifyInput } from "./dto/verify.dto";
import { LoginInput } from "./dto/login.dto";
import { UpdateInput } from "./dto/update.dto";
import { PasswordInput } from "./dto/password.dto";
import { CodeInput } from "./dto/code.dto";
import { ForgetInput } from "./dto/forget.dto";
import { NewPasswordInput } from "./dto/new_password.dto";

//Guards
import { Roles } from "../auth/decorator/auth.decorator";
import { Role } from "../auth/enum/auth.enum";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";

//Types
import { ReqUser } from "../auth/types/user.types";

@Resolver()
export class UserResolver {
    //Constructor
    constructor(
        private readonly userService: UserService
    ) { };

    //Get User
    @Query(() => User, { name: "getProfile" })
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getUser(
        @Context("user") reqUser: ReqUser
    ) {
        return reqUser;
    };

    //Create User
    @Mutation(() => SuccessInfo, { name: "signup" })
    signup(
        @Args("signupInput") signupInput: SignupInput
    ) {
        return this.userService.signup(signupInput);
    };

    //Verify User
    @Mutation(() => RegistrationInfo, { name: "verify" })
    verify(
        @Args("verifyInput") verifyInput: VerifyInput) {
        return this.userService.verify(verifyInput);
    }

    //Login user
    @Mutation(() => RegistrationInfo, { name: "login" })
    login(
        @Args("loginInput") loginInput: LoginInput) {
        return this.userService.login(loginInput);
    };

    //Code verify
    @Mutation(() => CodeInfo, { name: "codeVerify" })
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    code(
        @Args("codeInput") codeInput: CodeInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.userService.code(codeInput, reqUser);
    };

    //Update user
    @Mutation(() => SuccessInfo, { name: "updateProfile" })
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    update(
        @Args("updateInput") updateInput: UpdateInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.userService.update(updateInput, reqUser);
    };

    //Password change
    @Mutation(() => SuccessInfo, { name: "changePassword" })
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    password(
        @Args("passwordInput") passwordInput: PasswordInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.userService.password(passwordInput, reqUser);
    };

    //Forget Password
    @Mutation(() => SuccessInfo, { name: "forgetPassword" })
    forget(
        @Args("forgetInput") forgetInput: ForgetInput
    ) {
        return this.userService.forget(forgetInput);
    };

    //New password for forget password step
    @Mutation(() => SuccessInfo, { name: "newPassword" })
    newPassword(
        @Args("newPasswordInput") newPasswordInput: NewPasswordInput
    ) {
        return this.userService.newPassword(newPasswordInput);
    };
}