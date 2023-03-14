import { ConfigUtils } from '@depop/utils';
import { WorkerOptions } from 'bullmq';
import { RedisOptions } from 'ioredis';
import path from 'path';

export type WorkerConfig = WorkerOptions & {
    name: string;
};

export type MicroserviceConfig = {
    baseUrl: string;
    auth?: {
        prefix: string;
        token: string;
    };
};

export type TAppConfig = {
    minio: {
        bucketName: string;
        bucketUrl: string;
        connection: {
            endPoint: string;
            port: number;
            accessKey: string;
            secretKey: string;
            useSSL: boolean;
            region: string;
        };
    };
    redis: {
        connection: RedisOptions;
    };
    bullMQ: {
        queues: {
            indexSearch: WorkerConfig;
        };
    };
    microservices: {
        elastic: MicroserviceConfig;
    };
};

export const configUtils = new ConfigUtils<TAppConfig>(path.join(__dirname, 'env'));

export class ConfigWrapper {
    constructor(public config: TAppConfig) {}
}
