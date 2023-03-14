import { Migration } from '@mikro-orm/migrations';
import { colorFixtures } from '../fixtures/colors';

export class Migration20220604090112 extends Migration {
    async up(): Promise<void> {
        const knex = this.getKnex();
        for (const [ind, color] of colorFixtures.entries()) {
            this.addSql(
                knex('Color')
                    .insert({ ...color, order: ind * 2 })
                    .toQuery(),
            );
        }
    }

    async down(): Promise<void> {
        const knex = this.getKnex();
        this.addSql(
            knex('Color')
                .delete()
                .whereIn(
                    'code',
                    colorFixtures.map(({ code }) => code),
                )
                .toQuery(),
        );
    }
}
