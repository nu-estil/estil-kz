import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import {
    ProductDocument,
    ProductDocumentBrand,
    ProductDocumentCategory,
    ProductDocumentColor,
    ProductDocumentCondition,
    ProductDocumentImage,
    ProductDocumentSize,
    ProductDocumentUser,
} from '../types/documents/products';
import { TGetProductsParamDto } from '../types/dto/products';

export class ProductSuggestionsDto implements Record<'suggestions', string[]> {
    @IsString({ each: true })
    @IsNotEmpty()
    suggestions!: string[];
}

export class ProductDocumentDto implements ProductDocument {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => UserDto)
    user!: ProductDocumentUser;

    @IsOptional()
    @ValidateNested()
    @Type(() => BrandDto)
    brand!: ProductDocumentBrand | null;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CategoryDto)
    categories!: ProductDocumentCategory[];

    @IsOptional()
    @ValidateNested()
    @Type(() => SizeDto)
    size!: ProductDocumentSize | null;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ConditionDto)
    condition!: ProductDocumentCondition;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ColorDto)
    colors!: ProductDocumentColor[];

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ImageDto)
    images!: ProductDocumentImage[];

    @IsNotEmpty()
    @IsNumber()
    id!: number;

    @IsNotEmpty()
    @IsString()
    slug!: string;

    @IsNotEmpty()
    @IsString()
    description!: string;

    @IsNotEmpty()
    @IsNumber()
    price!: number;

    @IsNotEmpty()
    @IsString()
    currency!: string;

    @IsNotEmpty()
    @IsBoolean()
    isActive!: boolean;

    @IsNotEmpty()
    @IsBoolean()
    isApproved!: boolean;

    @IsNotEmpty()
    @IsBoolean()
    isSold!: boolean;

    @IsNotEmpty()
    @IsDateString()
    createdAt!: string;

    @IsNotEmpty()
    @IsDateString()
    updatedAt!: string;
}

export class UserDto implements ProductDocumentUser {
    @IsNotEmpty()
    @IsNumber()
    id!: number;

    @IsNotEmpty()
    @IsString()
    username!: string;
}

export class BrandDto implements ProductDocumentBrand {
    @IsNotEmpty()
    @IsNumber()
    id!: number;

    @IsNotEmpty()
    @IsString()
    name!: string;
}

export class ConditionDto implements ProductDocumentCondition {
    @IsNotEmpty()
    @IsNumber()
    id!: number;

    @IsNotEmpty()
    @IsString()
    title!: string;
}

export class SizeDto implements ProductDocumentSize {
    @IsNotEmpty()
    @IsNumber()
    id!: number;

    @IsNotEmpty()
    @IsString()
    title!: string;
}

export class ColorDto implements ProductDocumentColor {
    @IsNotEmpty()
    @IsNumber()
    id!: number;

    @IsNotEmpty()
    @IsString()
    title!: string;

    @IsNotEmpty()
    @IsString()
    hex!: string;

    @IsNotEmpty()
    @IsString()
    code!: string;
}

export class CategoryDto implements ProductDocumentCategory {
    @IsNotEmpty()
    @IsNumber()
    id!: number;

    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    path!: string;
}

export class ImageDto implements ProductDocumentImage {
    @IsNotEmpty()
    @IsNumber()
    id!: number;

    @IsNotEmpty()
    @IsString()
    original!: string;

    @IsNotEmpty()
    @IsObject()
    thumbnails!: object;
}

export class GetProductsParamDto implements TGetProductsParamDto {
    @IsNotEmpty()
    @IsNumber()
    offset!: number;

    @IsNotEmpty()
    @IsNumber()
    limit!: number;

    @IsOptional()
    @IsString()
    username!: string;

    @IsOptional()
    @IsNumber({}, { each: true })
    categories?: number[];

    @IsOptional()
    @IsNumber({}, { each: true })
    brands?: number[];

    @IsOptional()
    @IsNumber({}, { each: true })
    colors?: number[];

    @IsOptional()
    @IsNumber({}, { each: true })
    conditions?: number[];

    @IsOptional()
    @IsNumber({}, { each: true })
    sizes?: number[];

    @IsOptional()
    @IsNumber()
    minPrice?: number;

    @IsOptional()
    @IsNumber()
    maxPrice?: number;

    @IsOptional()
    @IsNumber()
    city?: number;

    @IsOptional()
    @IsBoolean()
    isSold?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsBoolean()
    isApproved?: boolean;
}
