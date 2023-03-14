import { Entity, Index, Property, Unique } from '@mikro-orm/core';
import { TSizeGroup } from '../types';
import { CustomBaseEntity } from './base';

@Entity()
export class SizeGroup extends CustomBaseEntity<TSizeGroup> implements TSizeGroup {
    @Property()
    @Unique()
    title!: string;

    @Property({ nullable: true })
    @Unique()
    slug!: string;

    @Property()
    description!: string;

    @Property()
    @Index()
    order!: number;
}
