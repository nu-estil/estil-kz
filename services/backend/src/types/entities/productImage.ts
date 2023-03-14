import { TBaseEntity } from './base';

export type TProductImage = TBaseEntity & {
    imageId: number;
    productId: number;
};
