import { PickNullable } from '../common/helpers';
import { TUser } from '../entities';

export type TUserCreateDto = PickNullable<
    Omit<TUser, 'id' | 'createdAt' | 'updatedAt' | 'lastLoggedIn'>,
    'description' | 'name' | 'cityId' | 'avatar' | 'whatsapp'
>;

export type TUserUpdateDto = Partial<
    Pick<TUserCreateDto, 'name' | 'avatar' | 'description' | 'cityId'>
>;
