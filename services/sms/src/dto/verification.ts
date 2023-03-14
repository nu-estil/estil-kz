import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CountryCode } from 'libphonenumber-js';
import {
    TConfirmPhoneDto,
    TSendVerificationSmsDto,
    TVerifyPhoneDto,
} from '../types/dto/verification';

export class SendVerificationSmsDto implements TSendVerificationSmsDto {
    @IsString()
    @IsNotEmpty()
    countryCode!: CountryCode;

    @IsString()
    @IsNotEmpty()
    phone!: string;
}

export class ConfirmPhoneDto implements TConfirmPhoneDto {
    @IsString()
    @IsNotEmpty()
    smsCode!: string;

    @IsUUID()
    @IsNotEmpty()
    verificationId!: string;
}

export class VerifyPhoneDto implements TVerifyPhoneDto {
    @IsUUID()
    @IsNotEmpty()
    verificationId!: string;
}
