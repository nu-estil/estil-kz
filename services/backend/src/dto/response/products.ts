import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { CreateImageDto } from '../product';

class CategoryDto {
    @IsNumber()
    id!: number;

    @IsString()
    name!: string;

    @IsString()
    slug!: string;
}

class ConditionDto {
    @IsNumber()
    id!: number;

    @IsString()
    title!: string;

    @IsString()
    description!: string;
}

class RatingDto {
    @IsNumber()
    count!: number;

    @IsNumber()
    rating!: number;
}

class AvatarDto {
    @IsUrl()
    150!: string;

    @IsUrl()
    310!: string;

    @IsUrl()
    428!: string;

    @IsUrl()
    624!: string;

    @IsUrl()
    1280!: string;
}

class BrandDto {
    @IsNumber()
    id!: number;

    @IsString()
    name!: string;
}

class SizeDto {
    @IsNumber()
    id!: number;

    @IsString()
    title!: string;
}

class SellerDto {
    @IsNumber()
    id!: number;

    @IsString()
    name!: string;

    @IsString()
    username!: string;

    @ValidateNested()
    @Type(() => AvatarDto)
    avatar!: AvatarDto;

    @ValidateNested()
    @Type(() => RatingDto)
    rating!: RatingDto;

    @IsNumber()
    productCount!: number;
}

export class ProductPreviewResponseDto {
    @IsNumber()
    id!: number;

    @IsString()
    title!: string;

    @IsString()
    description!: string;

    @IsString()
    slug!: string;

    @IsString()
    currency!: string;

    @IsNumber()
    price!: number;

    @IsString()
    createdAt!: string;

    @ValidateNested({ each: true })
    @Type(() => CreateImageDto)
    images!: CreateImageDto[];

    @IsNumber()
    likes!: number;

    @ValidateNested()
    @Type(() => CategoryDto)
    category!: CategoryDto;

    @ValidateNested()
    @Type(() => ConditionDto)
    condition!: ConditionDto;

    @ValidateNested()
    @Type(() => SellerDto)
    seller!: SellerDto;

    @ValidateNested()
    @IsOptional()
    @Type(() => BrandDto)
    brand: BrandDto | null = null;

    @ValidateNested()
    @IsOptional()
    @Type(() => SizeDto)
    size: SizeDto | null = null;

    @IsBoolean()
    isLiked!: boolean;

    @IsBoolean()
    moderator!: boolean;
}
