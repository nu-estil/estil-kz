import { ConfigUtils } from '@depop/utils';
import { TAppConfig } from '..';

export const defaultConfig = ConfigUtils.createConfig<TAppConfig>({
    minio: {
        bucketName: 'depop',
        connection: {
            accessKey: 'depop',
            secretKey: 'change-in-production',
            endPoint: '127.0.0.1',
            port: 9000,
            useSSL: false,
            region: 'us-east-1',
        },
        bucketUrl: 'http://localhost:9000',
    },
    redis: {
        connection: {
            host: '127.0.0.1',
            port: 6379,
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        },
    },
    bullMQ: {
        queues: {
            indexSearch: { name: 'index-search' },
        },
    },
    microservices: {
        elastic: {
            baseUrl: 'http://localhost:3002/private/products',
        },
    },
});

module.exports = defaultConfig;
