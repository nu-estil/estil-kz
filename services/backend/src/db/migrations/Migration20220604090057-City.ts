import { Migration } from '@mikro-orm/migrations';
import { cityFixtures } from '../fixtures/city';

export class Migration20220604090057 extends Migration {
    async up(): Promise<void> {
        const knex = this.getKnex();
        for (const city of cityFixtures) {
            this.addSql(knex('City').insert(city).toQuery());
        }
    }

    async down(): Promise<void> {
        const knex = this.getKnex();
        this.addSql(
            knex('City')
                .delete()
                .whereIn(
                    'slug',
                    cityFixtures.map(({ slug }) => slug),
                )
                .toQuery(),
        );
    }
}
