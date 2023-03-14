import { BaseEntity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { TBaseEntity } from '../types/entities/base';

export abstract class CustomBaseEntity<T extends TBaseEntity, K = void> extends BaseEntity<
    T,
    'id'
> {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | K;

    @PrimaryKey()
    id!: number;

    @Property({ default: 'now()' })
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date(), default: 'now()' })
    updatedAt: Date = new Date();
}
