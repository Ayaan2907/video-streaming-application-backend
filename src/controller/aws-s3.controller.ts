import Logging from "../library/logging.js";
import commonErrorActions from "../types/error.type.js";
import config from "../config/config.js";
import aws from "aws-sdk";
import uuid4 from "uuid4";

import {Request, Response, NextFunction} from "express";
const s3 = new aws.S3({
    apiVersion: "2006-03-01",
    params: { Bucket: config.aws.AWS_BUCKET_NAME },
});
const awsFileUploader = async (req: Request, res: Response, next: NextFunction) => {
    const { file } = req;
    const params = {
        Bucket: config.aws.AWS_BUCKET_NAME,
        Key: uuid4(),
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    try {
        const data = await s3.upload(params).promise();
        Logging.info(`Uploading file ${file.key} to s3`);
        // res.status(200).send({
        //     message: "File uploaded to s3",
        //     data: data,
        // });
        req.file = data;
        next();
    } catch (err) {
        commonErrorActions.other(res, err, "Error in uploading file to s3");
    }
}

// const awsFileUploader = async (file: any, name: string) => {
//     const params = {
//         Bucket: config.aws.AWS_BUCKET_NAME,
//         Key: name,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//     };
//     Logging.info(`Uploading file ${file.key} to s3`);
//     return s3.upload(params).promise();
// };

// get all from s3
const getAllFromS3 = async (req: Request, res: Response, next: NextFunction) => {
    const params = {
        Bucket: config.aws.AWS_BUCKET_NAME,
    };
    Logging.info(`Getting all files from s3`);
    const data = await s3.listObjectsV2(params).promise();
    res.status(200).send({
        message: "All files from s3",
        data: data,
    });
    next();
};


// get a specific from s3
const getAFileFromS3 = async (name: string) => {
    const params = {
        Bucket: config.aws.AWS_BUCKET_NAME,
        Key: name,
    };
    Logging.info(`Getting file ${name} from s3`);
    return s3.getObject(params).promise();
};

// delete a specific from s3
// const deleteAFileFromS3 = async (req: Request, res: Response, next: NextFunction) => {
//     const { name } = req.params;
//     const params = {
//         Bucket: config.aws.AWS_BUCKET_NAME,
//         Key: name,
//     };
//     Logging.info(`Deleting file ${name} from s3`);
//     const data = await s3.deleteObject(params).promise();
//     res.status(200).send({
//         message: "File deleted from s3",
//         data: data,
//     });
//     next();
// };

const deleteAFileFromS3 = async (name: string) => {
    const params = {
        Bucket: config.aws.AWS_BUCKET_NAME,
        Key: name,
    };
    Logging.info(`Deleting file ${name} from s3`);
    return s3.deleteObject(params).promise();
};

export { awsFileUploader, getAllFromS3, getAFileFromS3, deleteAFileFromS3 };