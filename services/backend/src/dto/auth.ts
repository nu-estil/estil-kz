import { Transform, Type } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import { TAuthLoginDto, TAuthRegistrationDto, TSendVerificationDto, TThumbnails } from '../types';
import { ThumbnailDto } from './user';

export class AuthLoginDto implements TAuthLoginDto {
    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;
}

export class AuthRegistrationDto implements TAuthRegistrationDto {
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase().trim())
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    description?: string | null | undefined;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase().trim())
    username!: string;

    @IsString()
    @IsOptional()
    whatsapp!: string | null;

    @IsOptional()
    @ValidateNested()
    @Type(() => ThumbnailDto)
    avatar?: TThumbnails;

    @IsNumber()
    @IsOptional()
    cityId!: number | null;

    @IsUUID()
    @IsNotEmpty()
    verificationId!: string;
}

export class SendVerificationDto implements TSendVerificationDto {
    @IsString()
    @IsNotEmpty()
    countryCode!: string;

    @IsString()
    @IsNotEmpty()
    phone!: string;
}
