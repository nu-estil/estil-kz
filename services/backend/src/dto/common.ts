import { IsNumber, IsOptional } from 'class-validator';
import { TPaginationParamDto } from '../types/dto/common';

export class PaginationParamDto implements TPaginationParamDto {
    @IsNumber()
    @IsOptional()
    offset!: number;

    @IsNumber()
    @IsOptional()
    limit!: number;
}
