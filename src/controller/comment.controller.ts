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
    const videoId = req.params.id;
    const { comment } = req.body;
    const { _id, role } = req.user;

    if (!videoId && !mongoose.Types.ObjectId.isValid(videoId)) {
        // this can be further fixed to check if the video exist in the database or not
        return commonErrorActions.missingFields(
            res,
            "Video Id or comment is missing"
        );
    }

    try {
        const newComment = new commentCollecion.Comment({
            videoId,
            comment,
            authorId: _id,
        });
        await newComment.save();
        try {
            // FIXME: try to find better way for repeated code
            await videoCollection.findByIdAndUpdate(videoId, {
                $push: { comments: newComment._id },
            });
        } catch (error) {
            commonErrorActions.other(
                res,
                error,
                "Error while updating video with comment"
            );
        }
        Logging.info(`Comment created in video with id: ${videoId}`);
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

    if (!id) {
        return commonErrorActions.missingFields(res, "Comment Id is missing");
    }

    try {
        const comment: IComment | null =
            await commentCollecion.Comment.findById(id);
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
    const videoId = req.params.id;

    if (!videoId) {
        return commonErrorActions.missingFields(
            res,
            "Video Id is required to fetch comments"
        );
    }

    try {
        const comments = await commentCollecion.Comment.find({ videoId });
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
    const commentID  = req.params.id;
    const { _id, role } = req.user;

    if (!commentID) {
        return commonErrorActions.missingFields(res, "Comment Id is missing");
    }

    try {
        const comment: IComment | null =
            await commentCollecion.Comment.findById(commentID);
        if (!comment) {
            return commonErrorActions.emptyResponse(res, "Comment not found");
        }

        if (comment?.authorId !== _id || role !== Role.ADMIN) {
            return commonErrorActions.unauthorized(
                res,
                "You are not authorized to delete this comment"
            );
        }

        commentCollecion.Comment.deleteOne({ _id: commentID }, (err) => {
            if (err) {
                return commonErrorActions.other(
                    res,
                    err,
                    "Error in deleting comment"
                );
            }
            try {
            // FIXME: try to find better way for repeated code
                videoCollection.findByIdAndUpdate(comment.videoId, {
                    $pull: { comments: commentID },
                });
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
