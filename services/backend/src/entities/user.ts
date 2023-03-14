import {
    BeforeCreate,
    BeforeUpdate,
    Entity,
    Index,
    ManyToOne,
    OnInit,
    Property,
    Unique,
} from '@mikro-orm/core';
import bcrypt from 'bcrypt';
import { TThumbnails, TUser } from '../types';
import { CustomBaseEntity } from './base';
import { City } from './city';

@Entity()
@Unique({ properties: ['phone', 'countryCode'] })
export class User extends CustomBaseEntity<TUser, 'lastLoggedIn' | 'whatsapp'> implements TUser {
    @Property({ unique: true })
    username!: string;

    @Property({ unique: true })
    email!: string;

    @Property()
    phone!: string;

    @Property({ nullable: true })
    countryCode!: string;

    @Property({ hidden: true })
    password!: string;

    @Property({ nullable: true, type: 'int' })
    cityId!: number | null;

    @Index()
    @Property({ nullable: true, type: 'varchar' })
    name!: string | null;

    @Property({ nullable: true, type: 'text' })
    description!: string | null;

    @Property({ type: 'json', nullable: true })
    avatar!: TThumbnails | null;

    @Property({ type: 'varchar', nullable: true })
    whatsapp!: string | null;

    @Property({ default: 'now()' })
    lastLoggedIn: Date = new Date();

    @BeforeCreate()
    private hashPassword() {
        if (this.password !== null) this.password = bcrypt.hashSync(this.password, 10);
    }

    @BeforeUpdate()
    private updatePassword(): void {
        // password has changed

        if (this.tempPassword !== this.password && this.password !== null) {
            this.password = bcrypt.hashSync(this.password, 10);
        }
    }

    private tempPassword!: string | null;

    @OnInit()
    private loadTempPassword(): void {
        this.tempPassword = this.password;
    }

    @ManyToOne({
        entity: () => City,
        joinColumn: 'cityId',
        nullable: true,
    })
    public city!: City | null;
}
