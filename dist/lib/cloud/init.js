"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3CloudProvider = void 0;
const env_1 = require("./../config/env");
const s3_cloud_1 = require("../../pkg/cloud/s3.cloud");
exports.s3CloudProvider = new s3_cloud_1.S3CloudProvider({
    region: env_1.env.aws.region,
    accesskey: env_1.env.aws.accesKey,
    secretAccessKey: env_1.env.aws.secretKey,
    bucketName: env_1.env.aws.bucketName
});
