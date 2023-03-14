import { ConfigUtils } from '@depop/utils';
import { TAppConfig } from '..';

export const composeConfig = ConfigUtils.createAppEnvConfig<TAppConfig>({
    server: {
        port: 3001,
    },
    db: {
        user: 'depop',
        dbName: 'depop',
        password: 'change-in-production',
        host: 'postgres',
        port: 5432,
    },
    minio: {
        bucketName: 'depop',
        bucketUrl: 'http://localhost/media',
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
        queue: {
            baseUrl: 'http://queue_service:3003/queue',
        },
    },
});

module.exports = composeConfig;
