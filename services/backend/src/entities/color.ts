import { Entity, Index, Property, Unique } from '@mikro-orm/core';
import { TColor } from '../types';
import { CustomBaseEntity } from './base';

@Entity()
export class Color extends CustomBaseEntity<TColor> implements TColor {
    @Property()
    @Unique()
    title!: string;

    @Property()
    hex!: string;

    @Property()
    code!: string;

    @Property()
    @Index()
    order!: number;

    @Property({ type: 'varchar', nullable: true })
    border!: string | null;
}
