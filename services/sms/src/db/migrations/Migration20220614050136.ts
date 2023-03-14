import { Migration } from '@mikro-orm/migrations';

export class Migration20220614050136 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "Verification" ("id" uuid not null, "createdAt" timestamptz(0) not null default \'now()\', "updatedAt" timestamptz(0) not null default \'now()\', "countryCode" varchar(255) not null, "isVerified" boolean not null default false, "phone" varchar(255) not null, "smsCode" varchar(255) not null, "expiration" timestamptz(0) not null);');
    this.addSql('alter table "Verification" add constraint "Verification_smsCode_phone_countryCode_unique" unique ("smsCode", "phone", "countryCode");');
    this.addSql('alter table "Verification" add constraint "Verification_pkey" primary key ("id");');
  }

}
