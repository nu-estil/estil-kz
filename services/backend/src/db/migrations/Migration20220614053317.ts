import { Migration } from '@mikro-orm/migrations';

export class Migration20220614053317 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "User" add column "countryCode" varchar(255) null;');
    this.addSql('alter table "User" drop constraint "User_phone_unique";');
    this.addSql('alter table "User" add constraint "User_phone_countryCode_unique" unique ("phone", "countryCode");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "User" drop constraint "User_phone_countryCode_unique";');
    this.addSql('alter table "User" drop column "countryCode";');
    this.addSql('alter table "User" add constraint "User_phone_unique" unique ("phone");');
  }

}
