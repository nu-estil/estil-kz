import { Entity, Index, Property, Unique } from '@mikro-orm/core';
import { TBrand } from '../types';
import { CustomBaseEntity } from './base';

@Entity()
export class Brand extends CustomBaseEntity<TBrand> implements TBrand {
    @Property()
    @Unique()
    name!: string;

    @Property()
    @Unique()
    slug!: string;

    @Property()
    @Index()
    order!: number;
}
