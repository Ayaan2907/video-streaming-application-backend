import commonErrorActions from "../types/error.type";
import { Request, Response, NextFunction } from "express";

const handleErrors = async (res: Response, err: Error, errorType: any) => {
    
    // return commonErrorActions[errorType](res, err);

    
}