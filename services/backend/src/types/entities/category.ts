import { TBaseEntity } from './base';

export type TCategory = TBaseEntity & {
    name: string;
    parentId: number | null;
    sizeGroupId: number | null;
    synonyms: string[];
    slug: string;
    order: number;
};
