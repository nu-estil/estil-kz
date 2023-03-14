import { TBaseEntity } from './base';

export type TColor = TBaseEntity & {
    title: string;
    hex: string;
    order: number;
    code: string;
    border: string | null;
};
