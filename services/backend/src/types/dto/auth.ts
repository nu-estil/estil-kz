import { TUser } from '../entities';

export type TAuthLoginDto = Pick<TUser, 'username' | 'password'>;

export type TAuthRegistrationDto = Pick<TUser, 'username' | 'email' | 'password' | 'name'> &
    Partial<Pick<TUser, 'avatar' | 'cityId' | 'description' | 'whatsapp'>> & {
        verificationId: string;
    };

export type TSendVerificationDto = {
    countryCode: string;
    phone: string;
};
