import { Cascade, Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { TRating } from '../types';
import { CustomBaseEntity } from './base';
import { Product } from './product';
import { User } from './user';

@Entity()
@Unique({ properties: ['raterId', 'productId'] })
export class Rating extends CustomBaseEntity<TRating> implements TRating {
    @Property()
    raterId!: number;

    @Property()
    rating!: number;

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

    @ManyToOne({
        entity: () => User,
        joinColumn: 'raterId',
        nullable: false,
        cascade: [Cascade.ALL],
    })
    public rater!: User;
}
