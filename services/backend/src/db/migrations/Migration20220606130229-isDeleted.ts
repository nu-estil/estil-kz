import { Migration } from '@mikro-orm/migrations';

export class Migration20220606130229 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Product" add column "isDeleted" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Product" drop column "isDeleted";');
  }

}
