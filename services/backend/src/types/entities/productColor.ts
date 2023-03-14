import { TBaseEntity } from './base';

export type TProductColor = TBaseEntity & {
    productId: number;
    colorId: number;
};
