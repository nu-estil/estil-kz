import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
} from 'class-validator';
import { TThumbnails } from '../types';
import {
    TCreateImageDto,
    TCreateProductDto,
    TGetBrandsDto,
    TGetProductsParamDto,
    TToggleProductLike,
    TUpdateProductDto,
} from '../types/dto/product';
import { PaginationParamDto } from './common';

export class GetBrandsDto extends PaginationParamDto implements TGetBrandsDto {
    @IsString()
    @IsOptional()
    name!: string;
}

export class CreateImageDto implements TCreateImageDto {
    @IsNumber()
    @IsNotEmpty()
    id!: number;

    @IsString()
    @IsNotEmpty()
    original!: string;

    // todo: create nested validation
    @IsObject()
    @IsNotEmpty()
    thumbnails!: TThumbnails;
}

export class CreateProductDto implements TCreateProductDto {
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(4)
    @IsNumber({}, { each: true })
    images!: number[];

    @IsArray()
    @ArrayMinSize(0)
    @ArrayMaxSize(3)
    @IsNumber({}, { each: true })
    colors!: number[];

    @IsNumber()
    @IsOptional()
    brandId!: number | null;

    @IsNumber()
    @IsOptional()
    cityId!: number | null;

    @IsNumber()
    @IsNotEmpty()
    categoryId!: number;

    @IsNumber()
    @IsNotEmpty()
    conditionId!: number;

    @IsNumber()
    @IsNotEmpty()
    price!: number;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsNumber()
    @IsOptional()
    sizeId!: number | null;
}

export class UpdateProductDto extends CreateProductDto implements TUpdateProductDto {}

export class ToggleProductLike implements TToggleProductLike {
    @IsNumber()
    @IsNotEmpty()
    productId!: number;
}

export class GetProductsParamDto implements TGetProductsParamDto {
    @IsNotEmpty()
    @IsNumber()
    offset!: number;

    @IsNotEmpty()
    @IsNumber()
    limit!: number;

    @IsOptional()
    @IsBoolean()
    allItems = true;

    @IsOptional()
    @IsBoolean()
    isSold = false;

    @IsOptional()
    @IsBoolean()
    isLiked = false;

    @IsOptional()
    @IsBoolean()
    isSelling = false;
}
