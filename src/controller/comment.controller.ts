import express, { Request, Response, NextFunction } from "express";

const createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.send("comment");
};
const getComment = async (req: Request, res: Response, next: NextFunction) => {
    res.send("comment");
};
const getAllComments = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // getting all comments to specific video
    res.send("comment");
};
const deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.send("comment");
};

export {
    createComment,
    getComment,
    getAllComments,
    deleteComment,
};
