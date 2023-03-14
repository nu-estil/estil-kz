import { TBaseEntity } from './base';

export type TCity = TBaseEntity & {
    name: string;
    slug: string;
};
