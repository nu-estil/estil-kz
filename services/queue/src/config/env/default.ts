import { ConfigUtils } from '@depop/utils';
import { TAppConfig } from '..';

export const defaultConfig = ConfigUtils.createConfig<TAppConfig>({
    server: {
        port: 3003,
        routePrefix: '',
        cors: {
            origin: ['*'],
            methods: ['GET', 'POST', 'PUT', 'PATCH'],
        },
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
        defaultQueueConfig: {
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 60 * 1000,
                },
            },
        },
        bullboard: {
            adminPath: '/bullboard',
            //TODO: set true by default
            disabled: false,
        },
    },
});

module.exports = defaultConfig;
