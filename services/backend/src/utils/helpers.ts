import mapValues from 'lodash/mapValues';
import slugify from 'slugify';
import { TThumbnails } from '../types';
export const generateSlug = (title: string) => {
    return slugify(title, { lower: true, replacement: '-', trim: true });
};

export const getAbsoluteThumbnails = (
    thumbnails: TThumbnails,
    minioHost: string,
    minioBucket: string,
) => {
    return mapValues(thumbnails, (thumb) => {
        if (!thumb.startsWith('http')) return combineURLs(minioHost, [minioBucket, thumb]);
        return thumb;
    });
};

export const combineURLs = (baseUrl: string, relativeUrls: string[]) => {
    return (
        baseUrl.replace(/\/+$/, '') +
        '/' +
        relativeUrls.map((url) => url.replace(/^\/+/, '')).join('/')
    );
};
