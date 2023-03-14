import { ConfigUtils } from '@depop/utils';
import { TAppConfig } from '..';

export const developmentConfig = ConfigUtils.createAppEnvConfig<TAppConfig>({
    db: {
        user: 'depop',
        dbName: 'depop',
        password: 'change-in-production',
        host: 'postgres',
        port: 5432,
    },
    minio: {
        bucketName: 'depop',
        bucketUrl: 'https://estil.kz/media',
    },
    elastic: {
        connection: {
            node: 'http://elasticsearch:9200',
        },
    },
});

module.exports = developmentConfig;
