import mapValues from 'lodash/mapValues';
import slugify from 'slugify';

export const generateSlug = (title: string) => {
    return slugify(title, { lower: true, replacement: '-', trim: true });
};

export const combineURLs = (baseUrl: string, relativeUrls: string[]) => {
    return (
        baseUrl.replace(/\/+$/, '') +
        '/' +
        relativeUrls.map((url) => url.replace(/^\/+/, '')).join('/')
    );
};

export const generateElasticIndex = (title: string) => {
    return slugify(title, { replacement: '_', lower: true, trim: true });
};

export const getAbsoluteThumbnails = (
    thumbnails: Record<string, string>,
    minioHost: string,
    minioBucket: string,
) => {
    return mapValues(thumbnails, (thumb) => {
        if (!thumb.startsWith('http')) return combineURLs(minioHost, [minioBucket, thumb]);
        return thumb;
    });
};
