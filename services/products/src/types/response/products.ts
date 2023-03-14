import { ProductDocument } from '../documents/products';
import { PaginatedResponse } from './common';

export type TProductPreview = Partial<
    Pick<ProductDocument, 'id' | 'slug' | 'price'> & {
        thumbnails: object;
    }
>;

export type TGetProductsResponse = PaginatedResponse<'products', TProductPreview[]>;
