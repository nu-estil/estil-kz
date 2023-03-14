import { makeMinioClient, MinioClient } from '@depop/minio';
import { AppLogger, getLogger, getPinoMiddleware } from '@depop/utils';
import { MikroORM } from '@mikro-orm/core';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { useContainer as useContainerForRouting, useExpressServer } from 'routing-controllers';
import { DependencyContainer } from 'tsyringe';
import { configUtils, ConfigWrapper } from './config';
import { controllers } from './controllers';
import { AuthMiddleware, CustomErrorHandler, makeAuthCheckers, OrmMiddleware } from './middlewares';
import { getContainer, getDBConnection, useSwaggerUI } from './utils';

export const configureDefaultContainer = async () => {
    const config = configUtils.getConfig();
    console.log(config);
    // GET CONTAINER AND REGISTER CONFIG
    const container = getContainer();
    container.register(ConfigWrapper, { useValue: new ConfigWrapper(config) });
    // REGISTER LOGGER
    const logger = getLogger({ logger: { level: 'debug' }, httpLogger: {} });
    container.register(AppLogger, { useValue: logger });
    // GET DB CONNECTION
    const ormClient = await getDBConnection(config);
    container.register(MikroORM, { useValue: ormClient });
    container.register(SqlEntityManager, { useValue: ormClient.em });
    return container;
};

export const configureServerContainer = async () => {
    const container = await configureDefaultContainer();
    const { config } = container.resolve(ConfigWrapper);

    const minioClient = await makeMinioClient(config.minio);
    await minioClient.waitUntilBucketReady(config.minio.bucketName, config.minio.connection.region);
    container.register(MinioClient, { useValue: minioClient });

    return container;
};

export const createServer = async (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const logger = container.resolve(AppLogger);

    useContainerForRouting(
        { get: (x) => container.resolve(x) },
        { fallback: false, fallbackOnErrors: false },
    );

    const app = express();

    app.use(getPinoMiddleware(logger, {}));

    app.use(cors({ origin: true, credentials: true }));

    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    useSwaggerUI(app, container); // swagger ui

    useExpressServer(app, {
        routePrefix: config.server.routePrefix,
        controllers,
        classTransformer: true,
        middlewares: [OrmMiddleware, AuthMiddleware, CustomErrorHandler],
        defaultErrorHandler: false,
        validation: true,
        ...makeAuthCheckers(),
    });

    app.listen(config.server.port);

    logger.debug('Express server listening on port ' + config.server.port);

    return app;
};
