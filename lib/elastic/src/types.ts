import { estypes, NodeOptions } from '@elastic/elasticsearch';

export type ElasticQuery = estypes.QueryDslQueryContainer;

export type ElasticConfig = {
    cloud?: { id: string };
    auth?: { apiKey: string };
    node?: string | string[] | NodeOptions | NodeOptions[];
    maxRetries?: number;
    requestTimeout?: number;
    /**
     * https://www.elastic.co/blog/elasticsearch-sniffing-best-practices-what-when-why-how
     */
    sniffOnStart?: boolean;
};

export type ElasticIndex = estypes.IndicesCreateRequest;
export type ElasticSearchTotalHits = estypes.SearchTotalHits;
