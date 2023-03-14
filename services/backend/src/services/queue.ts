import { makeAxiosInstance } from '@depop/utils';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../config';

@singleton()
export class QueueService {
    private api;
    constructor({ config }: ConfigWrapper) {
        this.api = makeAxiosInstance(
            { baseURL: config.microservices.queue.baseUrl },
            { retries: 3 },
        );
    }

    indexSearch(productId: number) {
        return this.api.post('/index-search', { productId });
    }
}
