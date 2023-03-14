import { makeAxiosInstance } from '@depop/utils';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../config';
import { ProductDocument } from '../types/documents/product';

@singleton()
export class ElasticService {
    private api;
    constructor({ config }: ConfigWrapper) {
        this.api = makeAxiosInstance(
            { baseURL: config.microservices.elastic.baseUrl },
            { retries: 3 },
        );
    }

    saveSuggestions(suggestions: string[]) {
        return this.api.post('/suggestions', { suggestions });
    }

    getProduct(productId: number) {
        return this.api.get<ProductDocument>(`/${productId}`).then(({ data }) => data);
    }
}
