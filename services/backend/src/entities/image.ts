import { Cascade, Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { TImage, TThumbnails } from '../types';
import { CustomBaseEntity } from './base';
import { Product } from './product';

@Entity()
export class Image extends CustomBaseEntity<TImage, 'product' | 'order'> implements TImage {
    @Property()
    original!: string;

    @Property({ nullable: true, type: 'int' })
    productId!: number | null;

    @Property({ type: 'jsonb' })
    thumbnails!: TThumbnails;

    @ManyToOne({
        entity: () => Product,
        joinColumn: 'productId',
        nullable: true,
        cascade: [Cascade.ALL],
    })
    product!: Product;

    @Property({ default: 0 })
    @Index()
    order!: number;
}
