import { Migration } from '@mikro-orm/migrations';
import { colorFixtures } from '../fixtures/colors';

export class Migration20220611060442 extends Migration {
    async up(): Promise<void> {
        const knex = this.getKnex();
        const deletedColors = knex('Color')
            .select('id')
            .whereNotIn(
                'title',
                colorFixtures.map(({ title }) => title),
            );

        this.addSql(knex('ProductColor').delete().whereIn('colorId', deletedColors).toQuery());
        this.addSql(knex('Color').delete().whereIn('id', deletedColors).toQuery());
        this.addSql(
            knex('Color')
                .insert(colorFixtures.map((color, ind) => ({ ...color, order: ind * 2 })))
                .onConflict('title')
                .merge()
                .toQuery(),
        );
    }

    async down(): Promise<void> {
        const knex = this.getKnex();
        this.addSql(
            knex('Color')
                .delete()
                .whereIn(
                    'title',
                    colorFixtures.map(({ title }) => title),
                )
                .toQuery(),
        );
    }
}
