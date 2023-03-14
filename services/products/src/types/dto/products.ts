import { TPaginationParamDto } from './common';

export type TGetProductsParamDto = TPaginationParamDto & {
    categories?: number[];
    username?: string;
    brands?: number[];
    conditions?: number[];
    colors?: number[];
    sizes?: number[];
    city?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    isSold?: boolean;
    isActive?: boolean;
    isApproved?: boolean;
    sort?: 'relevance' | 'priceMin' | 'priceMax' | 'recent';
};
