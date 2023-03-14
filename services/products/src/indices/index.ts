import { productIndex } from './product';
import { searchIndex } from './search';

export * from './product';
export * from './search';

export const elasticIndices = [searchIndex, productIndex];
