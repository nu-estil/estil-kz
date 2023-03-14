import { getLogger } from '@depop/utils';
import * as Minio from 'minio';
import { ConfigWithS3Options } from './types';
import { isBucketPublic, makePublicPolicyStringified } from './utils';

export const makeMinioClient = ({ connection }: ConfigWithS3Options): MinioClient => {
    // TODO: add retry
    const client = new MinioClient(connection);
    return client;
};

export class MinioClient extends Minio.Client {
    public async isBucketPublic(bucketName: string): Promise<boolean> {
        try {
            const currentPolicy = await this.getBucketPolicy(bucketName);
            return isBucketPublic(currentPolicy, bucketName);
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    public async waitUntilBucketReady(bucketName: string, region: string) {
        // (minioClient as any)?.traceOn();
        const logger = getLogger();
        logger.debug({ bucketName }, `Checking bucket ${bucketName}`);
        const bucketExists = await this.bucketExists(bucketName);
        if (!bucketExists) {
            await this.makeBucket(bucketName, region);
            logger.info({ bucketName }, `${bucketName} bucket created`);
        }

        const isBucketPublic = await this.isBucketPublic(bucketName);
        if (!isBucketPublic) {
            await this.setBucketPolicy(bucketName, makePublicPolicyStringified(bucketName));
            logger.info({ bucketName }, `[S3]: ${bucketName} bucket made public`);
        }
    }
}
