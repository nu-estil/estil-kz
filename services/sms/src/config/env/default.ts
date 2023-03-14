import { ConfigUtils } from '@depop/utils';
import { TAppConfig } from '..';

export const defaultConfig = ConfigUtils.createConfig<TAppConfig>({
    server: {
        port: 3004,
        routePrefix: '',
        cors: {
            origin: ['*'],
            methods: ['GET', 'POST', 'PUT', 'PATCH'],
        },
    },
    db: {
        user: 'postgres',
        dbName: 'depop_sms',
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
    admin: {
        routePrefix: '/admin',
        enabled: true,
        credentials: {
            email: 'admin',
            password: 'change-in-production',
            cookiePassword: 'change-in-production',
        },
    },
    mobizon: {
        apiUrl: 'https://api.mobizon.kz',
        apiKey: 'kz953e876769b08bc6aa21d6d78cb679dd8b3d0f98b75beeef1b061d71ffc2d69d90a6',
    },
});

module.exports = defaultConfig;
