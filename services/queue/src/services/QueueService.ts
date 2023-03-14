import { JobsOptions } from 'bullmq';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../config';
import { QueueWrapper } from '../types';
import { IndexSearchPayload } from '../types/queue/indexSearch';

@singleton()
export class QueueService {
    private queues;
    public constructor({ queues }: QueueWrapper, { config }: ConfigWrapper) {
        this.queues = queues;
    }

    indexSearch(data: IndexSearchPayload, opts?: JobsOptions) {
        return this.queues.indexSearch.add(`Index Search for product ${data.productId}`, data, {
            ...opts,
        });
    }
}
