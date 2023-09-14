import { ObjectId } from "mongoose";

export interface ReqUser {
    _id: ObjectId;
    name: string;
    email: string;
    verified: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}