import { Request, Response, NextFunction } from "express";
import { IVideo } from "../types/video.type.js";
import commonErrorActions from "../types/error.type.js";
import Logging from "../library/logging.js";
import videoCollection from "../models/video.model.js";
import mongoose from "mongoose";
import { Role } from "../types/user.type.js";
import config from "../config/config.js";
import multer from "multer";
import { awsFileUploader } from "./aws-s3.controller.js";

//  it is storing the file in memory
const multerUploader = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 524288000 },
});

const uploadVideo = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description } = req.body;
    const { _id, role } = req.user;
    const { file } = req;

    role === Role.STUDENT ??
        commonErrorActions.unauthorized(res, "Students can't upload video");

    try {
        const newVideo = new videoCollection({
            _id: new mongoose.Types.ObjectId(),
            title,
            description,
            author: _id,
            comments: [],
            likes: 0,
            dislikes: 0,
            // thumbnail: req.file
        });
        const fileUploadData = await awsFileUploader(
            file,
            newVideo._id.toString()
        );
        await newVideo.save();
        Logging.info(`Video ${newVideo._id} created`);
        res.status(201).send({
            message: "Video created",
            data: {
                title: newVideo.title,
                description: newVideo.description,
                author: newVideo.author,
                videoUrl: fileUploadData.Location,
            },
        });
        next();
    } catch (error) {
        commonErrorActions.other(res, error, "Error in saving video");
    }
};

const getVideo = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id)
        return commonErrorActions.missingFields(res, "Video id is missing");

    try {
        const video = await videoCollection.findById(id);
        if (!video)
            return commonErrorActions.emptyResponse(res, "Video not found");

        Logging.info(`Video ${video._id} found`);
        res.status(200).json({
            message: "Video found",
            data: video,
        });
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
        if (!videos)
            return commonErrorActions.emptyResponse(res, "No videos found");

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

    if (!id)
        return commonErrorActions.missingFields(res, "Video id is missing");

    try {
        const video = await videoCollection.findById(id);

        if (!video)
            return commonErrorActions.emptyResponse(res, "Video not found");

        (video.author._id !== _id || role !== Role.ADMIN) &&
            commonErrorActions.unauthorized(
                res,
                "Only admin, videos' author can delete video"
            );

        videoCollection.deleteOne({ _id: id }, (err) => {
            err ??
                commonErrorActions.other(res, err, "Error in deleting video");

            Logging.info(`Video ${id} deleted`);
            res.status(200).json({ message: "Video deleted successfully" });
        });
    } catch (error) {
        commonErrorActions.other(res, error, "Error in deleting video");
    }
};

export { getVideo, getAllVideos, uploadVideo, deleteVideo, multerUploader };
