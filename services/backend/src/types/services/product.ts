import { TCategory } from '../entities';

export type TCategoryAggregated = TCategory & {
    children: TCategoryAggregated[];
    path: string;
    sizeGroups: number[];
};
