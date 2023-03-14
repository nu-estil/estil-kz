import { TBaseEntity } from './base';
import { TThumbnails } from './image';

export type TUser = TBaseEntity & {
    username: string;
    email: string;
    phone: string;
    countryCode: string;
    password: string;
    name: string | null;
    description: string | null;
    cityId: number | null;
    avatar: TThumbnails | null;
    lastLoggedIn: Date;
    whatsapp: string | null;
};

export enum EUserRole {
    admin = 'ADMIN',
}
