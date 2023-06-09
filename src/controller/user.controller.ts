import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userCollection from "../models/user.model.js";
import commonErrorActions from "../types/error.type.js";
import Logging from "../library/logging.js";
import { IUser } from "../types/user.type.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    (!name || !email || !password || !role) ??
        commonErrorActions.missingFields(
            res,
            "Missing either name, email, role or password"
        );

    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            commonErrorActions.other(res, err, "Error in hashing password");
        } else {
            const user = new userCollection({
                _id: new mongoose.Types.ObjectId(),
                name,
                email,
                password: hash,
                role,
            });
            try {
                await user.save();
                Logging.info(`User ${user.name} created`);
                res.status(201).send({
                    message: "User created",
                    data: {
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                });
                next();
            } catch (error) {
                commonErrorActions.other(
                    res,
                    error,
                    "Error in saving user in database"
                );
            }
        }
    });
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id, email } = req.params;
    const decodedUser = req.user;

    // FIXME: unable to find using mail : unable to cast to objectId

    (!decodedUser || decodedUser._id !== id) ??
        commonErrorActions.unauthorized(res, "Cannot access other user's data");

    (!id && !email) ??
        commonErrorActions.missingFields(res, "Missing either id or email");

    try {
        const user = await (!email
            ? userCollection.findById(id)
            : userCollection.findOne({
                  email: email,
              }));

        if (!user)
            return commonErrorActions.emptyResponse(res, "User not found");

        Logging.info(`User ${user.name} found`);
        res.status(200).send({
            message: "User found",
            data: user,
        });
        next();
    } catch (error) {
        commonErrorActions.other(
            res,
            error,
            "Error in finding user in database"
        );
    }
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users: any = await userCollection.find();

        !users ?? commonErrorActions.emptyResponse(res, "No users found");
        Logging.info(`Users found: ${users.length}`);

        res.status(200).send({
            message: "Displaying all users",
            data: users.map((user: any) => {
                return {
                    ...user._doc,
                    password: "Very secure!",
                };
            }),
        });
    } catch (error) {
        commonErrorActions.other(
            res,
            error,
            "Error in finding users in database"
        );
    }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    (!email || !password) &&
        commonErrorActions.missingFields(
            res,
            "Missing either email or password"
        );

    try {
        const user: IUser | null = await userCollection.findOne({ email });

        if (!user)
            return commonErrorActions.emptyResponse(res, "User not found");

        // comparing the passwords and generating token
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return commonErrorActions.other(
                    res,
                    err,
                    "Error in decrypting passwords"
                );
            }
            if (result) {
                const token = jwt.sign(
                    {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    config.jwt.JWT_SECRET,
                    {
                        expiresIn: config.jwt.JWT_EXPIRY_TIME,
                    }
                );
                user.password = "Very secure!";
                res.header("x-auth-token").status(200).send({
                    message: "User logged in",
                    token: token,
                    data: user,
                });
                // res.status(200).send({ token });

                // setting the token in the header for next requests
                Logging.event(`Token generated for user: ${user.name}`);
                // res.set("Authorization", `Bearer ${token}`)

                // res.status(200)
                // .send({
                //     message: "User logged in",
                //     token: token,
                //     data: user,
                // });
                // .cookie("token", token, {
                //     httpOnly: true,
                //     secure: true,
                // });

                next();
            } else {
                commonErrorActions.unauthorized(res, "Invalid password");
            }
        });
    } catch (error) {
        commonErrorActions.other(res, error, "Error logging in user");
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    // following 2 lines might be unreliable, but I am doint it in this way for now
    const { id } = req.params;
    const decodedUser = req.user;
    const modifiedData = req.body;

    !id && commonErrorActions.missingFields(res, "Pass user id to update");

    id !== decodedUser._id ??
        commonErrorActions.unauthorized(res, "You can only update yourself");

    try {
        await userCollection
            .findByIdAndUpdate(id, modifiedData, {
                new: true,
                upsert: true,
            })
            .then((user) => {
                if (!user) {
                    return commonErrorActions.emptyResponse(
                        res,
                        "User not found"
                    );
                }
                Logging.event(`User "${user.name}" updated`);
                res.status(200).send("User updated");
            })
            .catch((err) => {
                commonErrorActions.other(
                    res,
                    err,
                    "Error updating user in database"
                );
            });
        // tried the above task using callbacks, but was not working
    } catch (error) {
        commonErrorActions.other(res, error, "Error updating user");
    }
};
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const decodedUser = req.user;

    !id ?? commonErrorActions.missingFields(res, "Pass user id to delete");

    id !== decodedUser._id ??
        commonErrorActions.unauthorized(res, "You can only update yourself");

    try {
        await userCollection
            .findOneAndRemove({ _id: id })
            .then((user) => {
                if (!user) {
                    return commonErrorActions.emptyResponse(
                        res,
                        "User not found"
                    );
                }
                Logging.event(`User ${user.name} deleted`);
                res.status(200).send("User deleted");
            })
            .catch((err) => {
                commonErrorActions.other(
                    res,
                    err,
                    "Error deleting user in database"
                );
            });
        // tried the above task using callbacks, but was not working
    } catch (error) {
        commonErrorActions.other(res, error, "Error deleting user");
    }
};

export default {
    createUser,
    getUser,
    getAllUsers,
    loginUser,
    updateUser,
    deleteUser,
};
