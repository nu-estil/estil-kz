import { Type } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
    ValidateNested,
} from 'class-validator';
import { TThumbnails, TUserCreateDto, TUserUpdateDto } from '../types';

export class UserCreateDto implements TUserCreateDto {
    @IsString()
    @IsNotEmpty()
    countryCode!: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    phone!: string;

    @IsString()
    @IsOptional()
    whatsapp!: string | null;

    @IsOptional()
    @ValidateNested()
    @Type(() => ThumbnailDto)
    avatar?: TThumbnails;

    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    @IsNotEmpty()
    cityId!: number | null;

    @IsString()
    @IsOptional()
    description!: string | null;
}

export class ThumbnailDto implements TThumbnails {
    @IsString()
    @IsNotEmpty()
    150!: string;

    @IsString()
    @IsNotEmpty()
    310!: string;

    @IsString()
    @IsNotEmpty()
    428!: string;

    @IsString()
    @IsNotEmpty()
    624!: string;

    @IsString()
    @IsNotEmpty()
    1280!: string;
}

export class UserUpdateDto implements TUserUpdateDto {
    @IsString()
    @IsOptional()
    name!: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => ThumbnailDto)
    avatar?: TThumbnails;

    @IsString()
    @IsOptional()
    description!: string;

    @IsNumber()
    @IsOptional()
    cityId?: number | null;
}
