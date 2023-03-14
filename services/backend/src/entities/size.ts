import { Cascade, Entity, Index, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { TSize } from '../types';
import { CustomBaseEntity } from './base';
import { SizeGroup } from './sizeGroup';

@Entity()
@Unique({ properties: ['title', 'sizeGroupId'] })
export class Size extends CustomBaseEntity<TSize> implements TSize {
    @Property()
    title!: string;

    @Property()
    sizeGroupId!: number;

    @Property()
    @Index()
    order!: number;

    @ManyToOne({
        entity: () => SizeGroup,
        joinColumn: 'sizeGroupId',
        nullable: false,
        cascade: [Cascade.ALL],
    })
    public sizeGroup!: SizeGroup;
}
