import { MinioClient } from '@depop/minio';
import { MikroORM, wrap } from '@mikro-orm/core';
import path from 'path';
import sharp from 'sharp';
import { singleton } from 'tsyringe';
import { v4 as uuid } from 'uuid';
import { ConfigWrapper } from '../config';
import { Image } from '../entities/image';
import { ALL_THUMBNAILS, TThumbnails, TThumbnailType } from '../types';
import { TImageCreateDto } from '../types/dto/image';
import { combineURLs, getAbsoluteThumbnails } from '../utils/helpers';

@singleton()
export class ImageService {
    private config;
    constructor(
        private orm: MikroORM,
        private minioClient: MinioClient,
        { config }: ConfigWrapper,
    ) {
        this.config = config.minio;
    }

    async uploadImage(objectName: string, data: Buffer) {
        await this.minioClient.putObject(this.config.bucketName, objectName, data);
        return objectName;
    }

    async uploadThumbnails(data: Buffer, dir: string): Promise<TThumbnails> {
        return ALL_THUMBNAILS.reduce(async (thumbsPromise, thumbnail) => {
            const thumbs = await thumbsPromise;
            const thumbnailBuffer = await this.createThumbnail(data, thumbnail);
            thumbs[thumbnail] = await this.uploadImage(
                path.join(dir, `${thumbnail}.jpeg`),
                thumbnailBuffer,
            );
            return thumbs;
        }, Promise.resolve({} as TThumbnails));
    }

    createThumbnail(data: Buffer, thumbnail: TThumbnailType) {
        return sharp(data).resize({ height: thumbnail, width: thumbnail }).toBuffer();
    }

    async saveImage(userId: number, imageBuffer: Buffer) {
        const imageRepository = this.orm.em.fork().getRepository(Image);

        const dir = path.join(`${userId}`, uuid());

        const thumbnails = await this.uploadThumbnails(imageBuffer, dir);

        const imageData: TImageCreateDto = {
            thumbnails,
            original: await this.uploadImage(path.join(dir, 'original.jpeg'), imageBuffer),
        };
        const image = imageRepository.create(imageData);
        await imageRepository.persist(image).flush();

        const { bucketName, bucketUrl } = this.config;

        image.original = combineURLs(bucketUrl, [bucketName, image.original]);
        image.thumbnails = getAbsoluteThumbnails(image.thumbnails, bucketUrl, bucketName);

        return wrap(image).toJSON();
    }
}
