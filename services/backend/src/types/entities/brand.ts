import { TBaseEntity } from './base';

export type TBrand = TBaseEntity & {
    name: string;
    slug: string;
    order: number;
};
