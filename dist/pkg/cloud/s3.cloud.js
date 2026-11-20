"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3CloudProvider = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class S3CloudProvider {
    client;
    bucketName;
    constructor(config) {
        this.client = new client_s3_1.S3Client({
            region: config.region,
            credentials: {
                accessKeyId: config.accesskey,
                secretAccessKey: config.secretAccessKey,
            }
        });
        this.bucketName = config.bucketName;
    }
    async uploudFile(file, path) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Body: file.buffer,
            ContentType: file.mimetype,
            Key: `${path}/--${new Date().toISOString()}--${file.originalname}`
        });
        await this.client.send(command);
        return command.input.Key;
    }
    async deleteFile(key) {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key
        });
        await this.client.send(command);
    }
    getFile(key) {
        throw new Error("Method not implemented.");
    }
}
exports.S3CloudProvider = S3CloudProvider;
