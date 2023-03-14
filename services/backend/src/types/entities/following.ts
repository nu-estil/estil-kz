import { TBaseEntity } from './base';

export type TFollowing = TBaseEntity & {
    userId: number;
    followerId: number;
};
