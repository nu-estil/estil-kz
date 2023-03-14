import { AppLogger } from '@depop/utils';
import { QueueScheduler, Worker } from 'bullmq';
import Redis from 'ioredis';
import { DependencyContainer } from 'tsyringe';
import { ConfigWrapper } from '../config';
import { TWorker } from '../types/worker';
import indexSearch from './indexSearch/worker';

export const workers: TWorker[] = [indexSearch];

export const runWorker = async (container: DependencyContainer, workerType: TWorker) => {
    const { config } = container.resolve(ConfigWrapper);
    const logger = container.resolve(AppLogger);
    const redis = container.resolve(Redis);

    const { name: key, processor } = workerType;
    const { queues } = config.bullMQ;

    const { name, ...workerConfig } = queues[key];

    await runQueueScheduler(container, name);

    const worker = new Worker(name, processor(container), {
        ...workerConfig,
        connection: redis,
        sharedConnection: true,
    });

    await worker.waitUntilReady();

    worker.on('active', () => logger.debug(`---${name}--- started`));
    worker.on('completed', () => logger.debug(`---${name}--- completed`));
    worker.on('failed', (job, err) => logger.error({ job, err }, `---${name}--- failed`));
    worker.on('error', (err) => logger.error({ err }, `---${name}--- errored`));
};

export const runQueueScheduler = async (container: DependencyContainer, queue: string) => {
    const redis = container.resolve(Redis);

    const queueScheduler = new QueueScheduler(queue, {
        connection: redis,
        sharedConnection: true,
    });

    await queueScheduler.waitUntilReady();
};
