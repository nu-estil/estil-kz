import { PaginationParamDto } from '../../dto/common';
import { Like } from '../../entities/like';
import { TBrand, TImage, TProduct } from '../entities';
import { TPaginationParamDto } from './common';

export type TGetBrandsDto = Partial<TPaginationParamDto & Pick<TBrand, 'name'>>;

export type TCreateProductDto = Pick<
    TProduct,
    'brandId' | 'categoryId' | 'conditionId' | 'price' | 'description' | 'sizeId' | 'cityId'
> & {
    images: number[];
    colors: number[];
};

export type TCreateImageDto = Pick<TImage, 'original' | 'thumbnails' | 'id'>;

export type TUpdateProductDto = TCreateProductDto;

export type TToggleProductLike = Pick<Like, 'productId'>;

export type TGetProductsParamDto = PaginationParamDto & {
    isSold: boolean;
    isLiked: boolean;
    allItems: boolean;
    isSelling: boolean;
};
