import { TBaseEntity } from './base';

export type TSize = TBaseEntity & {
    title: string;
    order: number;
    sizeGroupId: number;
};
