import { Migration } from '@mikro-orm/migrations';

export class Migration20220613113635 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "User" add column "phoneNumber" jsonb not null default \'{}\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "User" drop column "phoneNumber";');
  }

}
