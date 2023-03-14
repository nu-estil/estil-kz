import { ConfigUtils } from '@depop/utils';
import { TAppConfig } from '..';

export const developmentConfig = ConfigUtils.createAppEnvConfig<TAppConfig>({
    db: {
        user: 'depop_sms',
        dbName: 'depop_sms',
        password: 'change-in-production',
        host: 'postgres-sms',
        port: 5432,
    },
});

module.exports = developmentConfig;
