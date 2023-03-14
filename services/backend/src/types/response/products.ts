import { TProduct, TThumbnails } from '../entities';
import { PaginatedResponse } from './common';

export type TProductPreview = Pick<TProduct, 'id' | 'slug' | 'price'> & {
    thumbnails: TThumbnails;
};

export type TGetProductsResponse = PaginatedResponse<'products', TProductPreview[]>;
