import { Migration } from '@mikro-orm/migrations';
import { conditionFixtures } from '../fixtures/conditions';

export class Migration20220604090102 extends Migration {
    async up(): Promise<void> {
        const knex = this.getKnex();
        for (const [ind, condition] of conditionFixtures.entries()) {
            this.addSql(
                knex('Condition')
                    .insert({ ...condition, order: ind * 2 })
                    .toQuery(),
            );
        }
    }

    async down(): Promise<void> {
        const knex = this.getKnex();
        this.addSql(
            knex('Condition')
                .delete()
                .whereIn(
                    'title',
                    conditionFixtures.map(({ title }) => title),
                )
                .toQuery(),
        );
    }
}
