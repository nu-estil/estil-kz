import { Cascade, Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { TProductColor } from '../types';
import { CustomBaseEntity } from './base';
import { Color } from './color';
import { Product } from './product';

@Entity()
@Unique({ properties: ['productId', 'colorId'] })
export class ProductColor extends CustomBaseEntity<TProductColor> implements TProductColor {
    @Property()
    productId!: number;

    @Property()
    colorId!: number;

    @ManyToOne({
        entity: () => Product,
        joinColumn: 'productId',
        nullable: false,
        cascade: [Cascade.ALL],
    })
    public product!: Product;

    @ManyToOne({
        entity: () => Color,
        joinColumn: 'colorId',
        nullable: false,
        cascade: [Cascade.ALL],
    })
    public color!: Color;
}
