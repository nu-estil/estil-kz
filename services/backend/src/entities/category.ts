import { Cascade, Entity, Index, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { TCategory } from '../types';
import { CustomBaseEntity } from './base';
import { SizeGroup } from './sizeGroup';

@Entity()
@Unique({ properties: ['name', 'parentId'] })
@Unique({ properties: ['slug', 'parentId'] })
export class Category extends CustomBaseEntity<TCategory> implements TCategory {
    @Property()
    name!: string;

    @Property({ nullable: true, type: 'int' })
    parentId!: number | null;

    @Property({ nullable: true, type: 'int' })
    sizeGroupId!: number | null;

    @Property()
    slug!: string;

    @Property({ type: 'jsonb', default: '[]' })
    synonyms!: string[];

    @Property()
    @Index()
    order!: number;

    @ManyToOne({
        entity: () => SizeGroup,
        joinColumn: 'sizeGroupId',
        nullable: true,
    })
    public sizeGroup!: SizeGroup;

    @ManyToOne({
        entity: () => Category,
        joinColumn: 'parentId',
        nullable: true,
        cascade: [Cascade.ALL],
    })
    public parent!: Category | null;
}
