import { Migration } from '@mikro-orm/migrations';

export class Migration20220608073049 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Product" add column "cityId" int null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Product" drop column "cityId";');
  }

}
