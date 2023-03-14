import { Entity, Property, Unique } from '@mikro-orm/core';
import { TVerification } from '../types/entities/verification';
import { CustomBaseEntity } from './base';

@Entity()
@Unique({ properties: ['smsCode', 'phone', 'countryCode'] })
export class Verification
    extends CustomBaseEntity<TVerification, 'isVerified'>
    implements TVerification
{
    @Property()
    countryCode!: string;

    @Property({ default: false })
    isVerified!: boolean;

    @Property()
    phone!: string;

    @Property()
    smsCode!: string;

    @Property()
    expiration!: Date;
}
