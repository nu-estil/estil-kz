import { ConfigUtils } from '@depop/utils';
import { QueueOptions } from 'bullmq';
import { RedisOptions } from 'ioredis';
import path from 'path';

export type QueueConfig = QueueOptions & {
    name: string;
};

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
    redis: {
        connection: RedisOptions;
    };
    bullMQ: {
        queues: {
            indexSearch: QueueConfig;
        };
        bullboard: {
            adminPath: string;
            disabled: boolean;
        };
        defaultQueueConfig: QueueOptions;
    };
};

export const configUtils = new ConfigUtils<TAppConfig>(path.join(__dirname, 'env'));

export class ConfigWrapper {
    constructor(public config: TAppConfig) {}
}
