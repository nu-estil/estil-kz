import { TBaseEntity } from './base';

export type TProduct = TBaseEntity & {
    description: string;
    slug: string;
    userId: number;
    brandId: number | null;
    categoryId: number;
    sizeId: number | null;
    cityId: number | null;
    conditionId: number;
    price: number;
    promoted: boolean;
    currency: string;
    isActive: boolean;
    isApproved: boolean;
    isDeleted: boolean;
    isSold: boolean;
};
