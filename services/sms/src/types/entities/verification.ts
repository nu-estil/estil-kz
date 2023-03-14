import { TBaseEntity } from './base';

export type TVerification = TBaseEntity & {
    phone: string;
    smsCode: string;
    countryCode: string;
    isVerified: boolean;
    expiration: Date;
};
