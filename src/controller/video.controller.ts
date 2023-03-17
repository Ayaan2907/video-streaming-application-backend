import express, {  Request, Response, NextFunction } from "express";


const getVideo = async (req: Request, res: Response, next: NextFunction) => { res.send("sample")}
const getAllVideos = async (req: Request, res: Response, next: NextFunction) => { res.send("sample")}
const deleteVideo = async (req: Request, res: Response, next: NextFunction) => { res.send("sample")}
const uploadVideo = async (req: Request, res: Response, next: NextFunction) => { res.send("sample") }

export { getVideo, getAllVideos, uploadVideo, deleteVideo };
