import { Migration } from '@mikro-orm/migrations';
import { brandFixtures } from '../fixtures/brands';

export class Migration20220604090106 extends Migration {
    async up(): Promise<void> {
        const knex = this.getKnex();
        for (const [ind, brand] of brandFixtures.entries()) {
            this.addSql(
                knex('Brand')
                    .insert({ ...brand, order: ind * 2 })
                    .toQuery(),
            );
        }
    }

    async down(): Promise<void> {
        const knex = this.getKnex();
        this.addSql(
            knex('Brand')
                .delete()
                .whereIn(
                    'name',
                    brandFixtures.map(({ name }) => name),
                )
                .toQuery(),
        );
    }
}
