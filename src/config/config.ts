import dotenv from "dotenv";

dotenv.config();

const MONGO_USERNAME: string = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD: string = process.env.MONGO_PASSWORD || "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@users.wq7vfck.mongodb.net/`;

const SERVER_PORT: string = process.env.SERVER_PORT || "8000";
const SERVER_HOSTNAME: string = process.env.SERVER_HOSTNAME || "localhost";

const LOGGING_FLAG: boolean = process.env.LOGGING_FLAG === "true" || false;

const JWT_SECRET: string = process.env.JWT_SECRET || "secret";
const JWT_EXPIRY_TIME: string = process.env.JWT_EXPIRY_TIME || "1h";

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
const AWS_REGION = process.env.AWS_REGION || "";
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || "";
const AWS_S3_URL = process.env.AWS_S3_URL || "";

const config = {
    dataBase: {
        MONGO_URL,
    },
    server: {
        SERVER_PORT,
        SERVER_HOSTNAME,
    },
    logging: LOGGING_FLAG,
    jwt: {
        JWT_SECRET,
        JWT_EXPIRY_TIME,
    },
    aws: {
        AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY,
        AWS_REGION,
        AWS_BUCKET_NAME,
        AWS_S3_URL,
    },
};

export default config;
