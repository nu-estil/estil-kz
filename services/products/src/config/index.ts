import { ElasticConfig } from '@depop/elastic';
import { ConfigUtils } from '@depop/utils';
import path from 'path';

export type TAppConfig = {
    server: {
        port: number;
        routePrefix: string;
        ip?: string;
        cors: {
            origin: string[] | string | boolean;
            methods: string[];
        };
    };
    db: {
        user: string;
        password: string;
        dbName: string;
        host: string;
        port: number;
        entities: string[]; // path to our JS entities (dist), relative to `baseDir`
        entitiesTs: string[]; // path to our TS entities (src), relative to `baseDir`,
        migrations: {
            path: string;
            pathTs: string;
            disableForeignKeys: boolean;
            transactional: boolean;
        };
        debug: boolean;
    };
    auth: {
        secret: string;
        secure: boolean;
        accessExpiresIn: string | number;
        refreshExpiresIn: string | number;
        prefix: string;
    };
    minio: {
        bucketName: string;
        bucketUrl: string;
    };
    elastic: {
        connection: ElasticConfig;
    };
    swagger: {
        path: string;
    };
};

export const configUtils = new ConfigUtils<TAppConfig>(path.join(__dirname, 'env'));

export class ConfigWrapper {
    constructor(public config: TAppConfig) {}
}
