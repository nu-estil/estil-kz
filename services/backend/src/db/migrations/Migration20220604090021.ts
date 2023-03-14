import { Migration } from '@mikro-orm/migrations';

export class Migration20220604090021 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "SizeGroup" ("id" serial primary key, "createdAt" timestamptz(0) not null default \'now()\', "updatedAt" timestamptz(0) not null default \'now()\', "title" varchar(255) not null, "slug" varchar(255) null, "description" varchar(255) not null, "order" int not null);');
    this.addSql('alter table "SizeGroup" add constraint "SizeGroup_title_unique" unique ("title");');
    this.addSql('alter table "SizeGroup" add constraint "SizeGroup_slug_unique" unique ("slug");');
    this.addSql('create index "SizeGroup_order_index" on "SizeGroup" ("order");');

    this.addSql('create table "Size" ("id" serial primary key, "createdAt" timestamptz(0) not null default \'now()\', "updatedAt" timestamptz(0) not null default \'now()\', "title" varchar(255) not null, "sizeGroupId" int not null, "order" int not null);');
    this.addSql('create index "Size_order_index" on "Size" ("order");');
    this.addSql('alter table "Size" add constraint "Size_title_sizeGroupId_unique" unique ("title", "sizeGroupId");');

    this.addSql('create table "Condition" ("id" serial primary key, "createdAt" timestamptz(0) not null default \'now()\', "updatedAt" timestamptz(0) not null default \'now()\', "title" varchar(255) not null, "description" text not null, "explanation" text not null, "order" int not null);');
    this.addSql('alter table "Condition" add constraint "Condition_title_unique" unique ("title");');
    this.addSql('create index "Condition_order_index" on "Condition" ("order");');

    this.addSql('create table "Color" ("id" serial primary key, "createdAt" timestamptz(0) not null default \'now()\', "updatedAt" timestamptz(0) not null default \'now()\', "title" varchar(255) not null, "hex" varchar(255) not null, "code" varchar(255) not null, "order" int not null);');
    this.addSql('alter table "Color" add constraint "Color_title_unique" unique ("title");');
    this.addSql('create index "Color_order_index" on "Color" ("order");');

    this.addSql('create table "City" ("id" serial primary key, "createdAt" timestamptz(0) not null default \'now()\', "updatedAt" timestamptz(0) not null default \'now()\', "name" varchar(255) not null, "slug" varchar(255) not null);');
    this.addSql('alter table "City" add constraint "City_name_unique" unique ("name");');
    this.addSql('alter table "City" add constraint "City_slug_unique" unique ("slug");');

    this.addSql('create table "User" ("id" serial primary key, "createdAt" timestamptz(0) not null default \'now()\', "updatedAt" timestamptz(0) not null default \'now()\', "username" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) not null, "password" varchar(255) not null, "cityId" int null, "name" varchar(255) null, "description" text null, "avatar" jsonb null);');
    this.addSql('alter table "User" add constraint "User_username_unique" unique ("username");');
    this.addSql('alter table "User" add constraint "User_email_unique" unique ("email");');
    this.addSql('alter table "User" add constraint "User_phone_unique" unique ("phone");');
    this.addSql('create index "User_name_index" on "User" ("name");');

    this.addSql('create table "Following" ("id" serial primary key, "createdAt" timestamptz(0) not null default \'now()\', "updatedAt" timestamptz(0) not null default \'now()\', "userId" int not null, "followerId" int not null);');
    this.addSql('alter table "Following" add constraint "Following_userId_followerId_unique" unique ("userId", "followerId");');

    this.addSql('create table "Category" ("id" serial primary key, "createdAt" timestamptz(0) not null default \'now()\', "updatedAt" timestamptz(0) not null default \'now()\', "name" varchar(255) not null, "parentId" int null, "sizeGroupId" int null, "slug" varchar(255) not null, "synonyms" jsonb not null default \'[]\', "order" int not null);');
    this.addSql('create index "Category_order_index" on "Category" ("order");');
    this.addSql('alter table "Category" add constraint "Category_slug_parentId_unique" unique ("slug", "parentId");');
    this.addSql('alter table "Category" add constraint "Category_name_parentId_unique" unique ("name", "parentId");');

    this.addSql('create table "Brand" ("id" serial primary key, "createdAt" timestamptz(0) not null default \'now()\', "updatedAt" timestamptz(0) not null default \'now()\', "name" varchar(255) not null, "slug" varchar(255) not null, "order" int not null);');
    this.addSql('alter table "Brand" add constraint "Brand_name_unique" unique ("name");');
    this.addSql('alter table "Brand" add constraint "Brand_slug_unique" unique ("slug");');
    this.addSql('create index "Brand_order_index" on "Brand" ("order");');

    this.addSql('create table "Product" ("id" serial primary key, "createdAt" timestamptz(0) not null default \'now()\', "updatedAt" timestamptz(0) not null default \'now()\', "title" varchar(255) not null, "description" text not null, "userId" int not null, "brandId" int null, "categoryId" int not null, "sizeId" int null, "conditionId" int not null, "price" int not null, "promoted" boolean not null default false, "currency" varchar(255) not null default \'KZT\', "isActive" boolean not null default true, "isApproved" boolean not null default true, "slug" varchar(255) not null);');
    this.addSql('create index "Product_title_index" on "Product" ("title");');
    this.addSql('alter table "Product" add constraint "Product_slug_unique" unique ("slug");');

    this.addSql('create table "Image" ("id" serial primary key, "createdAt" timestamptz(0) not null default \'now()\', "updatedAt" timestamptz(0) not null default \'now()\', "original" varchar(255) not null, "productId" int null, "thumbnails" jsonb not null, "order" int not null default 0);');
    this.addSql('create index "Image_order_index" on "Image" ("order");');

    this.addSql('create table "Like" ("id" serial primary key, "createdAt" timestamptz(0) not null default \'now()\', "updatedAt" timestamptz(0) not null default \'now()\', "userId" int not null, "productId" int not null);');
    this.addSql('alter table "Like" add constraint "Like_userId_productId_unique" unique ("userId", "productId");');

    this.addSql('create table "ProductColor" ("id" serial primary key, "createdAt" timestamptz(0) not null default \'now()\', "updatedAt" timestamptz(0) not null default \'now()\', "productId" int not null, "colorId" int not null);');
    this.addSql('alter table "ProductColor" add constraint "ProductColor_productId_colorId_unique" unique ("productId", "colorId");');

    this.addSql('create table "Rating" ("id" serial primary key, "createdAt" timestamptz(0) not null default \'now()\', "updatedAt" timestamptz(0) not null default \'now()\', "raterId" int not null, "rating" int not null, "userId" int not null, "productId" int not null);');
    this.addSql('alter table "Rating" add constraint "Rating_raterId_productId_unique" unique ("raterId", "productId");');

    this.addSql('alter table "Size" add constraint "Size_sizeGroupId_foreign" foreign key ("sizeGroupId") references "SizeGroup" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "User" add constraint "User_cityId_foreign" foreign key ("cityId") references "City" ("id") on update cascade on delete set null;');

    this.addSql('alter table "Following" add constraint "Following_userId_foreign" foreign key ("userId") references "User" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "Following" add constraint "Following_followerId_foreign" foreign key ("followerId") references "User" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "Category" add constraint "Category_sizeGroupId_foreign" foreign key ("sizeGroupId") references "SizeGroup" ("id") on update cascade on delete set null;');
    this.addSql('alter table "Category" add constraint "Category_parentId_foreign" foreign key ("parentId") references "Category" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "Product" add constraint "Product_brandId_foreign" foreign key ("brandId") references "Brand" ("id") on update cascade on delete set null;');
    this.addSql('alter table "Product" add constraint "Product_categoryId_foreign" foreign key ("categoryId") references "Category" ("id") on update cascade;');
    this.addSql('alter table "Product" add constraint "Product_sizeId_foreign" foreign key ("sizeId") references "Size" ("id") on update cascade on delete set null;');
    this.addSql('alter table "Product" add constraint "Product_userId_foreign" foreign key ("userId") references "User" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "Product" add constraint "Product_conditionId_foreign" foreign key ("conditionId") references "Condition" ("id") on update cascade;');

    this.addSql('alter table "Image" add constraint "Image_productId_foreign" foreign key ("productId") references "Product" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "Like" add constraint "Like_userId_foreign" foreign key ("userId") references "User" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "Like" add constraint "Like_productId_foreign" foreign key ("productId") references "Product" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "ProductColor" add constraint "ProductColor_productId_foreign" foreign key ("productId") references "Product" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "ProductColor" add constraint "ProductColor_colorId_foreign" foreign key ("colorId") references "Color" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "Rating" add constraint "Rating_userId_foreign" foreign key ("userId") references "User" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "Rating" add constraint "Rating_productId_foreign" foreign key ("productId") references "Product" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "Rating" add constraint "Rating_raterId_foreign" foreign key ("raterId") references "User" ("id") on update cascade on delete cascade;');
  }

}
