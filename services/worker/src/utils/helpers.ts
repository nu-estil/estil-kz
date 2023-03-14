import slugify from 'slugify';

export const generateSlug = (title: string) => {
    return slugify(title, { lower: true, replacement: '-', trim: true });
};

export const generateElasticIndex = (title: string) => {
    return slugify(title, { replacement: '_', lower: true, trim: true });
};
