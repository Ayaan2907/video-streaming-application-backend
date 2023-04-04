import express, { Request, Response, NextFunction } from "express";
import {
    getComment,
    getAllComments,
    createComment,
    deleteComment,
} from "../controller/comment.controller.js";
import {
    getVideo,
    getAllVideos,
    uploadVideo,
    deleteVideo,
    multerUploader,
} from "../controller/video.controller.js";
import decodeAuthToken from "../middleware/decodeAuthToken.js";
import {awsFileUploader} from "../controller/aws-s3.controller.js";
const videoRoutes = express.Router();

// Private routes
videoRoutes.get("/all-videos", decodeAuthToken, getAllVideos);
videoRoutes.get("/video/:id", decodeAuthToken, getVideo, getAllComments);
videoRoutes.post(
    "/upload-video",
    decodeAuthToken,
    multerUploader.single("video"),
    awsFileUploader,
    uploadVideo
);
videoRoutes.delete("/video/:id", decodeAuthToken, deleteVideo);

// videoRoutes.post(
//     // test route
//     "/test",
//     multerUploader.fields([
//         { name: "video", maxCount: 1 },
//         { name: "thumbnail", maxCount: 1 },
//     ]),
//     async (req: Request, res: Response, next: NextFunction) => {
//         const { video, thumbnail } = req.files as any;
//         const { name, description } = req.body;
//         console.log(video[0]);
//         console.log(thumbnail);
//         console.log(name, description);
//         try {
//             const data = await awsFileUploader(video[0]);
//             console.log(data)
//             res.status(200).send(data)

//         } catch (error) {
//             console.log(error);
//         }
//     }
// );

export default videoRoutes;
