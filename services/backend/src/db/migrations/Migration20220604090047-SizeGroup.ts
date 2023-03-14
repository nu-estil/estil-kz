import { Migration } from '@mikro-orm/migrations';
import { sizeGroupFixtures } from '../fixtures/sizeGroup';

export class Migration20220604090047 extends Migration {
    async up(): Promise<void> {
        const knex = this.getKnex();
        for (const { sizes, ...sgData } of sizeGroupFixtures) {
            this.addSql(knex('SizeGroup').insert(sgData).toQuery());
            for (const [ind, sizeTitle] of sizes.entries()) {
                this.addSql(
                    knex('Size')
                        .insert({
                            order: ind * 2,
                            title: sizeTitle,
                            sizeGroupId: knex('SizeGroup').select('id').where('slug', sgData.slug),
                        })
                        .toQuery(),
                );
            }
        }
    }

    async down(): Promise<void> {
        const knex = this.getKnex();
        this.addSql(
            knex('SizeGroup')
                .delete()
                .whereIn(
                    'slug',
                    sizeGroupFixtures.map(({ slug }) => slug),
                )
                .toQuery(),
        );
    }
}
