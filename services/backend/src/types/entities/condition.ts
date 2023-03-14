import { TBaseEntity } from './base';

export type TCondition = TBaseEntity & {
    title: string;
    description: string;
    explanation: string;
    order: number;
};
