import { Request } from "express";
import { IUser } from "./user.type.js";
declare module "express-serve-static-core" {
    interface Request {
        user: IUser;
        file: any;
    }
}

declare module "multer";

// default Request type does not have user property, so we are extending it here for adding decoded user payload in our request
