import express, { Request, Response, NextFunction } from "express";
import { IVideo } from "../types/video.type.js";
import commonErrorActions from "../types/error.type.js";
import Logging from "../library/logging.js";
import videoCollection from "../models/video.model.js";
import mongoose from "mongoose";
import { Role } from "../types/user.type.js";
import validateAuthToken from "../middleware/decodeAuthToken.js";

const uploadVideo = async (req: Request, res: Response, next: NextFunction) => {
    const video: IVideo = req.body; // this is the video object currently treated as a text object
    const { title, description } = video;
    const { _id, role } = req.user;

    // const videoFile = req.file;
    // const videoFilePath = videoFile.path;

    // TODO: check missing fields later when actual video upload is implemented

    if (role === Role.STUDENT) {
        return commonErrorActions.unauthorized(
            res,
            "Students can't upload video"
        );
    }

    try {
        const newVideo = new videoCollection({
            _id: new mongoose.Types.ObjectId(),
            title,
            description,
            authorId: _id,
            comments: [],
            likes: 0,
            dislikes: 0,

            // video: {
            //     data: videoFilePath,
            //     contentType: videoFile.mimetype,
            // },
        });
        await newVideo.save();
        res.status(201).json({
            message: "Video uploaded",
            data: newVideo,
        });
    } catch (error) {
        commonErrorActions.other(res, error, "Error in saving video");
    }
};

const getVideo = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
        return commonErrorActions.missingFields(res, "Video id is missing");
    }
    try {
        const video = await videoCollection.findById(id);
        if (!video) {
            return commonErrorActions.emptyResponse(res, "Video not found");
        }
        Logging.info(`Video ${video._id} found`);
        res.status(200).json({
            message: "Video found",
            data: video,
        });

        // const videoFile = video.video.data;
        // res.set("Content-Type", video.video.contentType);
        // res.send(videoFile);
    } catch (error) {
        commonErrorActions.other(res, error, "Error in getting video");
    }
};
const getAllVideos = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const videos = await videoCollection.find();
        if (!videos) {
            return commonErrorActions.emptyResponse(res, "No videos found");
        }
        Logging.info(`Videos fetched`);
        res.status(200).json({
            message: "Videos fetched",
            data: videos,
        });
    } catch (error) {
        commonErrorActions.other(res, error, "Error in getting videos");
    }
};
const deleteVideo = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { _id, role } = req.user;

    if (!id) {
        return commonErrorActions.missingFields(res, "Video id is missing");
    }
    try {
        const video = await videoCollection.findById(id);
        if (!video) {
            return commonErrorActions.emptyResponse(res, "Video not found");
        }
        if (video.authorId !== _id || role !== Role.ADMIN) {
            return commonErrorActions.unauthorized(
                res,
                "Only admin, videos' author can delete video"
            );
        }

        videoCollection.deleteOne({ _id: id }, (err) => {
            if (err) {
                return commonErrorActions.other(
                    res,
                    err,
                    "Error in deleting video"
                );
            }
            Logging.info(`Video ${id} deleted`);
            res.status(200).json({ message: "Video deleted successfully" });
        });
    } catch (error) {
        commonErrorActions.other(res, error, "Error in deleting video");
    }
};

export { getVideo, getAllVideos, uploadVideo, deleteVideo };
