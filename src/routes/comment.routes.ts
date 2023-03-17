import express, { Request, Response, NextFunction } from "express";

import {
    createComment,
    getComment,
    getAllComments,
    deleteComment,
} from "../controller/comment.controller.js";
import decodeAuthToken from "../middleware/decodeAuthToken.js";

const commentRoutes = express.Router();

// Public routes
// none

// Private routes
commentRoutes.get("/all-videos", decodeAuthToken, getAllComments);
commentRoutes.get("/video/:id", decodeAuthToken, getComment);
commentRoutes.post("/upload-video", decodeAuthToken, createComment);
commentRoutes.delete("/video/:id", decodeAuthToken, deleteComment);

export default commentRoutes;
