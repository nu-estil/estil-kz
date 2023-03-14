import { Migration } from '@mikro-orm/migrations';

export class Migration20220613075843 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "User" add column "lastLoggedIn" timestamptz(0) not null default \'now()\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "User" drop column "lastLoggedIn";');
  }

}
