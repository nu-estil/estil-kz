import { TBaseEntity } from './base';

export const ALL_THUMBNAILS = [150, 310, 428, 624, 1280] as const;

export type TAllThumbnails = typeof ALL_THUMBNAILS;

export type TThumbnailType = TAllThumbnails[number];

export type TThumbnails = Record<TThumbnailType, string>;

export type TImage = TBaseEntity & {
    productId: number | null;
    original: string;
    thumbnails: TThumbnails;
    order: number;
};
