import { Queue, QueueBaseOptions } from 'bullmq';
import { Express } from 'express';
import Redis from 'ioredis';
import { DependencyContainer } from 'tsyringe';
import { ConfigWrapper, QueueConfig } from '../config';
import { AppQueues, QueueWrapper } from '../types';

export const getQueues = async (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const { queues: queueConfigs, defaultQueueConfig } = config.bullMQ;

    const redis = container.resolve(Redis);

    const queueDefaultConfig: QueueBaseOptions = {
        ...defaultQueueConfig,
        connection: redis,
        sharedConnection: true,
    };

    const queues: AppQueues = {
        indexSearch: getQueue(queueConfigs.indexSearch, queueDefaultConfig),
    };

    await Promise.all(Object.values(queues).map((x) => x.waitUntilReady()));

    return queues;
};

export const getQueue = (queueConfig: QueueConfig, defaultConfig: QueueBaseOptions) => {
    const { name, ...config } = queueConfig;
    const queue = new Queue(name, { ...defaultConfig, ...config });
    return queue;
};

export const useBullBoard = (app: Express, container: DependencyContainer) => {
    const { queues } = container.resolve(QueueWrapper);
    const { config } = container.resolve(ConfigWrapper);
    const { adminPath, disabled } = config.bullMQ.bullboard;

    // if (!disabled) {
    //     const serverAdapter = new ExpressAdapter();

    //     const { setQueues, replaceQueues } = createBullBoard({
    //         queues: Object.values(queues).map((x) => new BullMQAdapter(x)),
    //         serverAdapter,
    //     });

    //     serverAdapter.setBasePath(adminPath);

    //     app.use(adminPath, serverAdapter.getRouter());
    // }
};
