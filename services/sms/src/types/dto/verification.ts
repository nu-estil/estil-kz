import { CountryCode } from 'libphonenumber-js';
import { TVerification } from '../entities/verification';

export type TSendVerificationSmsDto = Pick<TVerification, 'phone'> & {
    countryCode: CountryCode;
};

export type TConfirmPhoneDto = Pick<TVerification, 'smsCode'> & {
    verificationId: string;
};

export type TVerifyPhoneDto = {
    verificationId: string;
};
