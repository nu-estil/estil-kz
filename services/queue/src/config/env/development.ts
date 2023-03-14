import { ConfigUtils } from '@depop/utils';
import { TAppConfig } from '..';

export const developmentConfig = ConfigUtils.createAppEnvConfig<TAppConfig>({
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
