import { Entity, Index, Property, Unique } from '@mikro-orm/core';
import { TCondition } from '../types';
import { CustomBaseEntity } from './base';

@Entity()
export class Condition extends CustomBaseEntity<TCondition> implements TCondition {
    @Property()
    @Unique()
    title!: string;

    @Property({ type: 'text' })
    description!: string;

    @Property({ type: 'text' })
    explanation!: string;

    @Property()
    @Index()
    order!: number;
}
