import sharp from 'sharp';

export const createThumbnail = (data: Buffer, opts: sharp.ResizeOptions) => {
    return sharp(data).resize(opts).toBuffer();
};
