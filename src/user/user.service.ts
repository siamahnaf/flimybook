import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MailerService } from "@nestjs-modules/mailer";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as speakeasy from "speakeasy";
import * as crypto from "crypto";

//Schema and Model
import { User, UserDocument } from "./model/user.schema";
import { Code, CodeDocument } from "./model/code.schema";

//Dto
import { SignupInput } from "./dto/signup.dto";
import { VerifyInput } from "./dto/verify.dto";
import { LoginInput } from "./dto/login.dto";
import { UpdateInput } from "./dto/update.dto";
import { PasswordInput } from "./dto/password.dto";
import { CodeInput } from "./dto/code.dto";
import { ForgetInput } from "./dto/forget.dto";
import { NewPasswordInput } from "./dto/new_password.dto";

//Types
import { ReqUser } from "../auth/types/user.types";

@Injectable()
export class UserService {
    //Constructor
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Code.name) private codeModel: Model<CodeDocument>,
        private readonly mailService: MailerService,
        private readonly jwtService: JwtService
    ) { };

    //Signup
    async signup(signupInput: SignupInput) {
        const hasUser = await this.userModel.findOne({
            email: signupInput.email
        });
        if (hasUser) throw new NotFoundException("User already exist!");
        const secret = speakeasy.generateSecret({ length: 20 });
        const otp = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
        });
        await this.mailService.sendMail({
            to: signupInput.email,
            from: "noreply@siamahnaf.com",
            subject: "Flimybook email verification code!",
            text: `Here is your Flimybook signup code(One time password) ${otp} . Please verify your email using this code.`
        });
        const password = await bcrypt.hash(signupInput.password, 12);
        const code = await bcrypt.hash(signupInput.code, 12);
        await this.userModel.create({
            ...signupInput,
            password,
            code,
            otp: secret.base32
        })
        return {
            success: true,
            message: "Code sent successfully!"
        }
    };

    //Verify Email and Otp
    async verify(verifyInput: VerifyInput) {
        const user = await this.userModel.findOne({
            email: verifyInput.email
        }).select("+otp");
        if (!user) throw new NotFoundException("You use an expired code!");
        var validOtp = speakeasy.totp.verify({
            secret: user.otp,
            encoding: 'base32',
            token: verifyInput.otp,
            window: 10
        });
        if (!validOtp) throw new NotFoundException("Wrong or expired otp!");
        const token = this.jwtService.sign({ email: user.email, id: user.id });
        user.verified = true;
        user.otp = "";
        await user.save();
        return {
            success: true,
            message: "User registered successfully!",
            token
        }
    };

    //Login
    async login(loginInput: LoginInput) {
        const user = await this.userModel.findOne({
            email: loginInput.email
        }).select("+password");
        if (!user) throw new NotFoundException("Wrong email or password!");
        const verifyPass = await bcrypt.compare(loginInput.password, user.password);
        if (!verifyPass) throw new NotFoundException("Wrong email or password!");
        const token = this.jwtService.sign({ email: user.email, id: user.id });
        return {
            success: true,
            message: "User login successfully!",
            token
        }
    };

    //Code verify
    async code(codeInput: CodeInput, reqUser: ReqUser) {
        const user = await this.userModel.findOne({
            _id: reqUser._id
        }).select("+code");
        const verifyCode = await bcrypt.compare(codeInput.code, user.code);
        if (!verifyCode) throw new NotFoundException("Wrong code!");
        const id = crypto.randomBytes(16).toString("hex");
        const code = await this.codeModel.findOne({
            user: reqUser._id
        })
        if (code) {
            await this.codeModel.findByIdAndUpdate(code._id, { code: id }, { new: true })
        } else {
            await this.codeModel.create({ code: id, user: reqUser._id })
        }
        return {
            success: true,
            message: "Code verified successfully!",
            verifiedId: id
        }
    }

    //Update
    async update(updateInput: UpdateInput, reqUser: ReqUser) {
        const user = await this.userModel.findByIdAndUpdate(reqUser._id, updateInput, { new: true })
        if (!user) throw new NotFoundException("User not found!");
        return {
            success: true,
            message: "Profile updated successfully!"
        }
    }

    //Password change
    async password(passwordInput: PasswordInput, reqUser: ReqUser) {
        const user = await this.userModel.findOne({
            _id: reqUser._id
        }).select("+password");
        const verifyPass = await bcrypt.compare(passwordInput.oldPassword, user.password);
        if (!verifyPass) throw new NotFoundException("Please give correct password");
        const password = await bcrypt.hash(passwordInput.newPassword, 12);
        const code = await bcrypt.hash(passwordInput.code, 12);
        await this.userModel.findByIdAndUpdate(reqUser._id, {
            password,
            code
        }, { new: true })
        return {
            success: true,
            message: "Password change successfully!"
        }
    }

    //Forget Password
    async forget(forgetInput: ForgetInput) {
        const user = await this.userModel.findOne({
            email: forgetInput.email
        });
        if (!user) throw new NotFoundException("User not found with this email!");
        const secret = speakeasy.generateSecret({ length: 20 });
        const otp = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
        });
        await this.mailService.sendMail({
            to: forgetInput.email,
            from: "noreply@siamahnaf.com",
            subject: "Flimybook email verification code!",
            text: `Here is your Flimybook password reset code(One time password) ${otp} . Please verify your email using this code.`
        });
        user.otp = secret.base32;
        await user.save();
        return {
            success: true,
            message: "Passwrod reset code sent successfully!"
        }
    }

    //New Password For Forget password Step
    async newPassword(newPasswordInput: NewPasswordInput) {
        const user = await this.userModel.findOne({
            email: newPasswordInput.email
        }).select("+otp");
        if (!user) throw new NotFoundException("User not found with this email!");
        var validOtp = speakeasy.totp.verify({
            secret: user.otp,
            encoding: 'base32',
            token: newPasswordInput.code,
            window: 10
        });
        if (!validOtp) throw new NotFoundException("Wrong or expired otp!");
        user.otp = "";
        user.password = await bcrypt.hash(newPasswordInput.password, 12)
        await user.save();
        return {
            success: true,
            message: "Password reset successfully!"
        }
    }
}