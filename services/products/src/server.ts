import { ElasticClient, makeElasticClient } from '@depop/elastic';
import { AppLogger, getLogger, getPinoMiddleware } from '@depop/utils';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { useContainer as useContainerForRouting, useExpressServer } from 'routing-controllers';
import { DependencyContainer } from 'tsyringe';
import { configUtils, ConfigWrapper } from './config';
import { controllers } from './controllers';
import { AuthMiddleware, CustomErrorHandler, makeAuthCheckers } from './middlewares';
import { getContainer, useSwaggerUI } from './utils';

export const configureServerContainer = async () => {
    const config = configUtils.getConfig();
    console.log(config);
    // GET CONTAINER AND REGISTER CONFIG
    const container = getContainer();
    container.register(ConfigWrapper, { useValue: new ConfigWrapper(config) });
    // REGISTER LOGGER
    const logger = getLogger({ logger: { level: 'debug' }, httpLogger: {} });
    container.register(AppLogger, { useValue: logger });

    const elastic = makeElasticClient(config.elastic.connection);
    container.register(ElasticClient, { useValue: elastic });
    // await elastic.createIndices(elasticIndices);

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
        middlewares: [AuthMiddleware, CustomErrorHandler],
        defaultErrorHandler: false,
        validation: true,
        ...makeAuthCheckers(),
    });

    app.listen(config.server.port);

    logger.debug('Express server listening on port ' + config.server.port);

    return app;
};
