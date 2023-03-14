import { AppLogger, getLogger } from '@depop/utils';
import Redis from 'ioredis';
import minimist from 'minimist';
import { DependencyContainer } from 'tsyringe';
import { configUtils, ConfigWrapper } from './config';
import { runWorker, workers } from './consumers';
import { getContainer } from './utils';

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

    return container;
};

export const createServer = async (container: DependencyContainer) => {
    const logger = container.resolve(AppLogger);

    const { worker: workerName } = minimist(process.argv.slice(2));

    if (workerName) {
        const worker = workers.find(({ name }) => name === workerName);
        if (!worker) {
            logger.error(
                `Worker ${workerName} does not exist, valid options are: ${workers
                    .map(({ name }) => name)
                    .join(', ')}`,
            );
            process.exit(0);
        }

        await runWorker(container, worker);
        logger.info('Listening to ${workerName} worker');
    } else {
        await Promise.all(workers.map((w) => runWorker(container, w)));
        logger.info(`Listening to workers: ${workers.map(({ name }) => name).join(', ')}`);
    }
};
