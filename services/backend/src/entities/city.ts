import { Entity, Property, Unique } from '@mikro-orm/core';
import { TCity } from '../types';
import { CustomBaseEntity } from './base';

@Entity()
export class City extends CustomBaseEntity<TCity> implements TCity {
    @Property()
    @Unique()
    name!: string;

    @Property()
    @Unique()
    slug!: string;
}
