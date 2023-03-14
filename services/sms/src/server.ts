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
import { CustomErrorHandler, OrmMiddleware } from './middlewares';
import { getContainer, getDBConnection } from './utils';

export const configureServerContainer = async () => {
    const config = configUtils.getConfig();
    // GET CONTAINER AND REGISTER CONFIG
    const container = getContainer();
    container.register(ConfigWrapper, { useValue: new ConfigWrapper(config) });
    // REGISTER LOGGER
    const logger = getLogger({ logger: { level: 'debug' }, httpLogger: {} });
    container.register(AppLogger, { useValue: logger });

    const ormClient = await getDBConnection(config);
    container.register(MikroORM, { useValue: ormClient });
    container.register(SqlEntityManager, { useValue: ormClient.em });

    return container;
};

export const createServer = async (container: DependencyContainer) => {
    const logger = container.resolve(AppLogger);
    const { config } = container.resolve(ConfigWrapper);

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

    useExpressServer(app, {
        routePrefix: config.server.routePrefix,
        controllers,
        middlewares: [OrmMiddleware, CustomErrorHandler],
        classTransformer: true,
        defaultErrorHandler: false,
        validation: true,
    });

    app.listen(config.server.port);

    logger.debug('Express server listening on port ' + config.server.port);

    return app;
};
