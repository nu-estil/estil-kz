import { Migration } from '@mikro-orm/migrations';

export class Migration20220613142154 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "User" add column "whatsapp" varchar(255) null;');
    this.addSql('alter table "User" drop column "phoneNumber";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "User" add column "phoneNumber" jsonb not null default \'{}\';');
    this.addSql('alter table "User" drop column "whatsapp";');
  }

}
