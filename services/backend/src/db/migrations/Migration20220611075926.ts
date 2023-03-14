import { Migration } from '@mikro-orm/migrations';

export class Migration20220611075926 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop index "Product_title_index";');
    this.addSql('alter table "Product" drop column "title";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Product" add column "title" varchar(255) not null;');
    this.addSql('create index "Product_title_index" on "Product" ("title");');
  }

}
