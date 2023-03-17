import express, { Request, Response, NextFunction } from "express";

import {
    createComment,
    getComment,
    getAllComments,
    deleteComment,
} from "../controller/comment.controller.js";
import decodeAuthToken from "../middleware/decodeAuthToken.js";

const commentRoutes = express.Router();

// Private routes
// FIXME: refactoring for comment routes needed 
commentRoutes.get("/all-comments/:videoId", decodeAuthToken, getAllComments);
// commentRoutes.get("/comment/:id", decodeAuthToken, getComment);
commentRoutes.post("/create-comment", decodeAuthToken, createComment);
commentRoutes.delete("/delete-comment/:id", decodeAuthToken, deleteComment);

export default commentRoutes;
