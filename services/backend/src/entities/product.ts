import { Cascade, Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { TProduct } from '../types';
import { CustomBaseEntity } from './base';
import { Brand } from './brand';
import { Category } from './category';
import { Condition } from './condition';
import { Size } from './size';
import { User } from './user';

@Entity()
export class Product
    extends CustomBaseEntity<
        TProduct,
        | 'promoted'
        | 'currency'
        | 'isActive'
        | 'isApproved'
        | 'isDeleted'
        | 'isSold'
        | 'brand'
        | 'category'
        | 'user'
        | 'size'
        | 'condition'
        | 'cityId'
    >
    implements TProduct
{
    @Property({ type: 'text' })
    description!: string;

    @Property()
    userId!: number;

    @Property({ nullable: true, type: 'int' })
    brandId!: number | null;

    @Property({ nullable: true, type: 'int' })
    cityId!: number | null;

    @Property()
    categoryId!: number;

    @Property({ nullable: true, type: 'int' })
    sizeId!: number | null;

    @Property()
    conditionId!: number;

    @Property()
    price!: number;

    @Property({ default: false })
    promoted!: boolean;

    @Property({ default: 'KZT' })
    currency!: string;

    @Property({ default: true })
    isActive!: boolean;

    @Property({ default: true })
    isApproved!: boolean;

    @Property({ default: false })
    isDeleted!: boolean;

    @Property({ default: false })
    isSold!: boolean;

    @Property()
    @Unique()
    slug!: string;

    @ManyToOne({
        entity: () => Brand,
        joinColumn: 'brandId',
        nullable: true,
    })
    public brand!: Brand | null;

    @ManyToOne({
        entity: () => Category,
        joinColumn: 'categoryId',
        nullable: false,
    })
    public category!: Category;

    @ManyToOne({
        entity: () => Size,
        joinColumn: 'sizeId',
        nullable: true,
    })
    public size!: Size | null;

    @ManyToOne({
        entity: () => User,
        joinColumn: 'userId',
        nullable: false,
        cascade: [Cascade.ALL],
    })
    public user!: User;

    @ManyToOne({
        entity: () => Condition,
        joinColumn: 'conditionId',
        nullable: false,
    })
    public condition!: Condition;

    // @OneToMany(() => ProductColor, (pc) => pc.product)
    // public productColors = new Collection<ProductColor>(this);

    // @OneToMany(() => Image, (image) => image.product)
    // public images = new Collection<Image>(this);
}
