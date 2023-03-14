import { TBaseEntity } from './base';

export type TSizeGroup = TBaseEntity & {
    title: string;
    slug: string;
    description: string;
    order: number;
};
