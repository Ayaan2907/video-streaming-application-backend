import Logging from "../library/logging.js";
import config from "../config/config.js";
import aws from "aws-sdk";

const s3 = new aws.S3({
    apiVersion: "2006-03-01",
    params: { Bucket: config.aws.AWS_BUCKET_NAME },
});

const awsFileUploader = async (file: any, name: string) => {
    const params = {
        Bucket: config.aws.AWS_BUCKET_NAME,
        Key: name,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    Logging.info(`Uploading file ${file.name} to s3`);
    return s3.upload(params).promise();
};

// get all from s3

// get a specific from s3

// delete a specific from s3

export { awsFileUploader };
