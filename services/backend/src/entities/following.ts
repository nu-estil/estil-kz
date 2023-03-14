import { Cascade, Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { TFollowing } from '../types';
import { CustomBaseEntity } from './base';
import { User } from './user';

@Entity()
@Unique({ properties: ['userId', 'followerId'] })
export class Following extends CustomBaseEntity<TFollowing> implements TFollowing {
    @Property()
    userId!: number;

    @Property()
    followerId!: number;

    @ManyToOne({
        entity: () => User,
        joinColumn: 'userId',
        nullable: false,
        cascade: [Cascade.ALL],
    })
    public user!: User;

    @ManyToOne({
        entity: () => User,
        joinColumn: 'followerId',
        nullable: false,
        cascade: [Cascade.ALL],
    })
    public follower!: User;
}
