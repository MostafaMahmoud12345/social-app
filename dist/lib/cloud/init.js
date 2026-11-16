import { env } from './../config/env';
import { S3CloudProvider } from "../../pkg/cloud/s3.cloud";
export const s3CloudProvider = new S3CloudProvider({
    region: env.aws.region,
    accesskey: env.aws.accesKey,
    secretAccessKey: env.aws.secretKey
});
