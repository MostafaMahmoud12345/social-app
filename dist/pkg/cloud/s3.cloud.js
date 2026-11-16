import { S3Client } from '@aws-sdk/client-s3';
export class S3CloudProvider {
    client;
    constructor(config) {
        this.client = new S3Client({
            region: config.region,
            credentials: {
                accessKeyId: config.accesskey,
                secretAccessKey: config.secretAccessKey,
            }
        });
    }
}
