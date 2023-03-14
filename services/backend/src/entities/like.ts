import { Cascade, Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { TLike } from '../types';
import { CustomBaseEntity } from './base';
import { Product } from './product';
import { User } from './user';

@Entity()
@Unique({ properties: ['userId', 'productId'] })
export class Like extends CustomBaseEntity<TLike> implements TLike {
    @Property()
    userId!: number;

    @Property()
    productId!: number;

    @ManyToOne({
        entity: () => User,
        joinColumn: 'userId',
        nullable: false,
        cascade: [Cascade.ALL],
    })
    public user!: User;

    @ManyToOne({
        entity: () => Product,
        joinColumn: 'productId',
        nullable: false,
        cascade: [Cascade.ALL],
    })
    public product!: Product;
}
