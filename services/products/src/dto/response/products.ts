import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, IsUrl, ValidateNested } from 'class-validator';

class MetadataDto {
    @IsBoolean()
    hasMore!: boolean;

    @IsNumber()
    offset!: number;

    @IsNumber()
    resultCount!: number;
}

class ThumbnailDto {
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

class ProductPreviewDto {
    @IsNumber()
    id!: number;

    @IsNumber()
    price!: number;

    @IsString()
    slug!: number;

    @ValidateNested()
    @Type(() => ThumbnailDto)
    thumbnails!: ThumbnailDto;
}

export class ProductPreviewResponseDto {
    @ValidateNested({ each: true })
    @Type(() => ProductPreviewDto)
    products!: ProductPreviewDto[];

    @ValidateNested()
    @Type(() => MetadataDto)
    metadata!: MetadataDto;
}
