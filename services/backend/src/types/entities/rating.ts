import { TBaseEntity } from './base';

export type TRating = TBaseEntity & {
    productId: number;
    userId: number;
    raterId: number;
    rating: number;
};
