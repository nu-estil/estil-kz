import { ConfigUtils } from '@depop/utils';
import { TAppConfig } from '..';

export const defaultConfig = ConfigUtils.createConfig<TAppConfig>({
    server: {
        port: 3002,
        routePrefix: '',
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
    minio: {
        bucketName: 'depop',
        bucketUrl: 'http://localhost:9000',
    },
    elastic: {
        connection: {
            node: 'http://localhost:9200',
            maxRetries: 5,
            requestTimeout: 60000,
            sniffOnStart: true,
        },
    },
    swagger: {
        path: '/api/docs',
    },
});

module.exports = defaultConfig;
