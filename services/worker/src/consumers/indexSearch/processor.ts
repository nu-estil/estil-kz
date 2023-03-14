import { AppLogger } from '@depop/utils';
import { Job } from 'bullmq';
import { DependencyContainer } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { ProductService } from '../../services/ProductService';
import { IndexSearchPayload } from '../../types/worker/indexSearch';

export const indexSearchProcessor = (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const logger = container.resolve(AppLogger);
    const productService = container.resolve(ProductService);

    return (job: Job<IndexSearchPayload>) => {
        const {
            data: { productId },
        } = job;

        return productService.indexSearch(productId);
    };
};
