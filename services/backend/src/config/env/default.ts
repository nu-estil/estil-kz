import { ConfigUtils } from '@depop/utils';
import { TAppConfig } from '..';

export const defaultConfig = ConfigUtils.createConfig<TAppConfig>({
    server: {
        port: 3001,
        routePrefix: '/api',
        cors: {
            origin: ['*'],
            methods: ['GET', 'POST', 'PUT', 'PATCH'],
        },
    },
    db: {
        user: 'postgres',
        dbName: 'depop_dev',
        password: 'change-in-production',
        host: '127.0.0.1',
        port: 5432,
        entities: ['./dist/entities'], // path to our JS entities (dist), relative to `baseDir`
        entitiesTs: ['./src/entities'], // path to our TS entities (src), relative to `baseDir`,
        migrations: {
            path: './dist/db/migrations',
            pathTs: './src/db/migrations',
            transactional: true,
            disableForeignKeys: false,
        },
        debug: false,
    },
    auth: {
        secret: 'change-in-production',
        accessExpiresIn: '15m',
        refreshExpiresIn: '30 days',
        secure: false,
        prefix: 'JWT',
    },
    admin: {
        routePrefix: '/admin',
        enabled: true,
        credentials: {
            email: 'admin',
            password: 'change-in-production',
            cookiePassword: 'change-in-production',
        },
    },
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
    microservices: {
        elastic: {
            baseUrl: 'http://localhost:3002/private/products',
        },
        queue: {
            baseUrl: 'http://localhost:3003/queue',
        },
        sms: {
            baseUrl: 'http://localhost:3004/private/verification',
        },
    },
    swagger: {
        path: '/api/docs',
    },
});

module.exports = defaultConfig;
