import { Request, Response, NextFunction } from "express";
import commonErrorActions from "../types/error.type.js";
import { IComment } from "../types/comment.type.js";
import commentCollecion from "../models/comment.model.js";
import videoCollection from "../models/video.model.js";
import Logging from "../library/logging.js";
import { Role } from "../types/user.type.js";
import mongoose from "mongoose";

const createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const videoID = req.params.id;
    const { comment } = req.body;
    const { _id, role } = req.user;

    !videoID &&
        !mongoose.Types.ObjectId.isValid(videoID) &&
        commonErrorActions.missingFields(res, "Video Id or comment is missing");
    // this can be further fixed to check if the video exist in the database or not

    try {
        const newComment = new commentCollecion.Comment({
            video: videoID,
            comment,
            author: _id,
        });
        await newComment.save();
        try {
            await videoCollection.findByIdAndUpdate(videoID, {
                $push: { comments: newComment._id },
            });
        } catch (error) {
            commonErrorActions.other(
                res,
                error,
                "Error while updating video with comment"
            );
        }
        Logging.info(`Comment created in video with id: ${videoID}`);
        res.status(201).json({
            message: "Comment created",
            data: newComment,
        });
    } catch (error) {
        commonErrorActions.other(res, error, "Error while creating comment");
    }
};

const getComment = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id)
        return commonErrorActions.missingFields(res, "Comment Id is missing");

    try {
        const comment: IComment | null =
            await commentCollecion.Comment.findById(id);
        if (!comment)
            return commonErrorActions.emptyResponse(res, "Comment not found");

        Logging.info(`Comment fetched with id: ${id}`);
        res.status(200).json({
            message: "Comment fetched",
            data: comment,
        });
    } catch (error) {
        commonErrorActions.other(
            res,
            error,
            "Error while fetching the comment"
        );
    }
};
const getAllComments = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const videoID = req.params.id;

    if (!videoID)
        return commonErrorActions.missingFields(
            res,
            "Video Id is required to fetch comments"
        );

    try {
        const comments = await commentCollecion.Comment.find({ videoID });
        Logging.info("Comments fetched");
        res.status(200).json({
            message: "Comments fetched",
            data: comments,
        });
        next();
    } catch (error) {
        commonErrorActions.other(res, error, "Error while fetching comments");
    }
};
const deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const commentID = req.params.id;
    const { _id, role } = req.user;

    if (!commentID)
        return commonErrorActions.missingFields(res, "Comment Id is missing");

    try {
        const comment: IComment | null =
            await commentCollecion.Comment.findById(commentID);

        if (!comment)
            return commonErrorActions.emptyResponse(res, "Comment not found");

        (comment.author.toString() !== _id || role !== Role.ADMIN) &&
            commonErrorActions.unauthorized(
                res,
                "You are not authorized to delete this comment"
            );

        commentCollecion.Comment.deleteOne({ _id: commentID }, async (err) => {
            err ??
                commonErrorActions.other(res, err, "Error in deleting comment");

            try {
                await videoCollection.findByIdAndUpdate(comment.video._id, {
                    $pull: { comments: commentID },
                });
                Logging.info(`comment ${commentID} deleted from video`);
            } catch (error) {
                commonErrorActions.other(
                    res,
                    error,
                    "Error while updating video with deeted comments"
                );
            }
            Logging.info(`Video ${commentID} deleted`);
            res.status(200).json({ message: "comment deleted" });
        });
    } catch (error) {
        commonErrorActions.other(
            res,
            error,
            "Error while deleting the comment"
        );
    }
};

export { createComment, getComment, getAllComments, deleteComment };
