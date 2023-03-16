import Logging from "../library/logging.js";
import { Response } from "express";

const commonErrorActions = {
    missingFields: (res: Response, message?:any) => {
        const error = new Error(`Missing Fields : ${message}`);
        Logging.error(error);
        return res.status(400).json({ error: error.message });
    },
    unauthorized: (res: Response, message?:any) => {
        const error = new Error(`Unauthorized : ${message}`);
        Logging.error(error);
        return res.status(401).json({ error: error.message });
    },

    emptyResponse: (res: Response, message?:any) => {
        const error = new Error(`Not found : ${message}`);
        Logging.error(error);
        return res.status(404).json({ error: error.message });
    },

    invalid: (res: Response, message?:any) => {
        const error = new Error(`Invalid : ${message}`);
        Logging.error(error);
        return res.status(400).json({ error: error.message });
    },
    other: (res: Response, error: Error | unknown, message?:any) => {
        Logging.error({error, message});
        return res.status(500).json({ error: error , extraInfo: message});
    },
};

export default commonErrorActions;
