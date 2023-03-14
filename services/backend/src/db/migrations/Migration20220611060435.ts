import { Migration } from '@mikro-orm/migrations';

export class Migration20220611060435 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Color" add column "border" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Color" drop column "border";');
  }

}
