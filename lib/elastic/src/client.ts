import { Client, estypes } from '@elastic/elasticsearch';
import { ElasticConfig } from './types';

export const makeElasticClient = (config: ElasticConfig) => {
    const client = new ElasticClient({ ...config, maxRetries: 5 });
    return client;
};

export class ElasticClient extends Client {
    async createIndices(indices: estypes.IndicesCreateRequest[]) {
        for (const index of indices) {
            if (!(await this.indices.exists({ index: index.index })))
                await this.indices.create(index);
        }
    }
}
