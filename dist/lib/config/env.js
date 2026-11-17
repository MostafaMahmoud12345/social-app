"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)({ path: path_1.default.resolve(process.cwd(), '.env') });
const schema = zod_1.z.object({
    PORT: zod_1.z.string().default('3000'),
    MONGODB_URL: zod_1.z.string(),
    JWT_ACCESS_SECRET: zod_1.z.string(),
    JWT_REFRESH_SECRET: zod_1.z.string(),
    MAIL_USER: zod_1.z.string().trim().toLowerCase(),
    MAIL_PASSWORD: zod_1.z.string(),
    GOOGLE_WEB_OAUTH_CLIENT_ID: zod_1.z.string(),
    REDIS_PORT: zod_1.z.string().default('6379'),
    REDIS_HOST: zod_1.z.string(),
    REDIS_PASSWORD: zod_1.z.string(),
    MAILJET_API_KEY: zod_1.z.string(),
    MAILJET_API_SECRET: zod_1.z.string(),
    MAILJET_FROM_EMAIL: zod_1.z.string(),
    MAILJET_FROM_NAME: zod_1.z.string(),
    S3_REGION: zod_1.z.string(),
    S3_BUCKET_NAME: zod_1.z.string(),
    S3_ACCESS_KEY: zod_1.z.string(),
    S3_SECRET_KEY: zod_1.z.string(),
});
const parsed = schema.parse(process.env);
exports.env = {
    port: Number(parsed.PORT),
    db: {
        url: parsed.MONGODB_URL,
    },
    google: {
        webClientId: parsed.GOOGLE_WEB_OAUTH_CLIENT_ID,
        iosClientId: parsed.GOOGLE_WEB_OAUTH_CLIENT_ID,
    },
    redis: {
        host: parsed.REDIS_HOST,
        port: Number(parsed.REDIS_PORT),
        password: parsed.REDIS_PASSWORD,
    },
    nodemailer: {
        name: parsed.MAIL_USER,
        pass: parsed.MAIL_PASSWORD,
    },
    mailjet: {
        apiKey: parsed.MAILJET_API_KEY,
        apiSecret: parsed.MAILJET_API_SECRET,
        fromEmail: parsed.MAILJET_FROM_EMAIL,
        fromName: parsed.MAILJET_FROM_NAME,
    },
    jwt: {
        accessSecret: parsed.JWT_ACCESS_SECRET,
        refreshSecret: parsed.JWT_REFRESH_SECRET
    },
    aws: {
        bucketName: parsed.S3_BUCKET_NAME,
        accesKey: parsed.S3_ACCESS_KEY,
        secretKey: parsed.S3_SECRET_KEY,
        region: parsed.S3_REGION
    },
};
