import { AppLogger, getLogger, getPinoMiddleware } from '@depop/utils';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import Redis from 'ioredis';
import { useContainer as useContainerForRouting, useExpressServer } from 'routing-controllers';
import { DependencyContainer } from 'tsyringe';
import { configUtils, ConfigWrapper } from './config';
import { controllers } from './controllers';
import { CustomErrorHandler } from './middlewares';
import { QueueWrapper } from './types';
import { getContainer } from './utils';
import { getQueues, useBullBoard } from './utils/queue';

export const configureServerContainer = async () => {
    const config = configUtils.getConfig();
    // GET CONTAINER AND REGISTER CONFIG
    const container = getContainer();
    container.register(ConfigWrapper, { useValue: new ConfigWrapper(config) });
    // REGISTER LOGGER
    const logger = getLogger({ logger: { level: 'debug' }, httpLogger: {} });
    container.register(AppLogger, { useValue: logger });

    const redis = new Redis(config.redis.connection);

    redis.on('error', (err) => {
        logger.error('[REDIS] error connecting', { err });
        process.exit(0);
    });
    container.register(Redis, { useValue: redis });

    const queues = await getQueues(container);
    container.register(QueueWrapper, { useValue: new QueueWrapper(queues) });

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

    useBullBoard(app, container);

    useExpressServer(app, {
        routePrefix: config.server.routePrefix,
        controllers,
        middlewares: [CustomErrorHandler],
        classTransformer: true,
        defaultErrorHandler: false,
        validation: true,
    });

    app.listen(config.server.port);

    logger.debug('Express server listening on port ' + config.server.port);

    return app;
};
