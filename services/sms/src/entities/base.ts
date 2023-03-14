import { BaseEntity, OptionalProps, PrimaryKey, Property, t } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { TBaseEntity } from '../types/entities/base';

export abstract class CustomBaseEntity<T extends TBaseEntity, K = void> extends BaseEntity<
    T,
    'id'
> {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | K;

    @PrimaryKey({ name: 'id', type: t.uuid })
    id = v4();

    @Property({ default: 'now()' })
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date(), default: 'now()' })
    updatedAt: Date = new Date();
}
