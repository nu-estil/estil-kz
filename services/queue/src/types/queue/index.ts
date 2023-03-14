import { Queue } from 'bullmq';
import { IndexSearchPayload } from './indexSearch';

export type AppQueues = {
    indexSearch: Queue<IndexSearchPayload>;
};

export class QueueWrapper {
    public constructor(public queues: AppQueues) {}
}
