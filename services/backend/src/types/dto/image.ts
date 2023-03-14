import { PickNullable } from '../common/helpers';
import { TImage } from '../entities';

export type TImageCreateDto = PickNullable<
    Omit<TImage, 'id' | 'createdAt' | 'updatedAt'>,
    'productId' | 'order'
>;

export type TImageUpdateDto = Partial<TImageCreateDto>;
