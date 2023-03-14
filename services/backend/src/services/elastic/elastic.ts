import { makeAxiosInstance } from '@depop/utils';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { ElasticProductDocument } from './types';

@singleton()
export class ElasticService {
    private api;
    constructor({ config }: ConfigWrapper) {
        this.api = makeAxiosInstance(
            { baseURL: config.microservices.elastic.baseUrl },
            { retries: 3 },
        );
    }

    saveProduct(product: ElasticProductDocument) {
        return this.api.post('/', product);
    }
}
