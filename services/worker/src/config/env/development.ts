import { ConfigUtils } from '@depop/utils';
import { TAppConfig } from '..';

export const developmentConfig = ConfigUtils.createAppEnvConfig<TAppConfig>({
    minio: {
        bucketName: 'depop',
        bucketUrl: 'https://estil.kz/media',
        connection: {
            accessKey: 'depop',
            secretKey: 'change-in-production',
            endPoint: 'minio',
            port: 9000,
            useSSL: false,
            region: 'us-east-1',
        },
    },
    microservices: {
        elastic: {
            baseUrl: 'http://products_service:3002/private/products',
        },
    },
    redis: {
        connection: {
            host: 'redis',
            port: 6379,
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        },
    },
});

module.exports = developmentConfig;
