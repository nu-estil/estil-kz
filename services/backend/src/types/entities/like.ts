import { TBaseEntity } from './base';

export type TLike = TBaseEntity & {
    userId: number;
    productId: number;
};
