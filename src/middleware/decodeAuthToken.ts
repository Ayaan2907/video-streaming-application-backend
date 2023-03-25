import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import Logging from "../library/logging.js";
import commonErrorActions from "../types/error.type.js";
import { IUser } from "../types/user.type.js";

const decodeAuthToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return commonErrorActions.missingFields(res, "Token is missing");
    }
    try {
        jwt.verify(token, config.jwt.JWT_SECRET, (err, decodedUser) => {
           if (err) return commonErrorActions.other(res, err);
            Logging.info(`Token is valid for user: ${decodedUser as IUser}`);
            // res.status(200).send({
            //     message: "Token is valid",  
            //     user: decodedUser as IUser,
            // });

            req.user = decodedUser as IUser;
            next();
        });
    } catch (error) {
        commonErrorActions.other(res, error, "Error in token decoding");
    }
};

export default decodeAuthToken;
