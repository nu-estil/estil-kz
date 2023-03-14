import { Migration } from '@mikro-orm/migrations';
import { Knex } from '@mikro-orm/postgresql';
import { categoryFixture, CategoryFixture } from '../fixtures/category';

export class Migration20220604090052 extends Migration {
    async up(): Promise<void> {
        const knex = this.getKnex();
        await insertFixtures(knex, categoryFixture, this);
    }

    async down(): Promise<void> {
        const knex = this.getKnex();
        this.addSql(
            knex('Category')
                .delete()
                .whereIn(
                    'name',
                    categoryFixture.map(({ name }) => name),
                )
                .toQuery(),
        );
    }
}

const insertFixtures = async (
    knex: Knex,
    categories: CategoryFixture[],
    migrationManager: Migration,
): Promise<any> => {
    const queue: { parentId: number | null; children: CategoryFixture[]; parent: any }[] = [];

    queue.push({ parentId: null, children: categories, parent: null });

    while (queue.length > 0) {
        // categories to insert
        const m = queue.shift()!;
        for (const [ind, category] of m.children.entries()) {
            const { sizeGroupSlug, children, ...categoryData } = category;
            // insert category
            const [{ id }] = await migrationManager.execute(
                knex('Category')
                    .insert({
                        ...categoryData,
                        synonyms: JSON.stringify(categoryData.synonyms),
                        order: ind * 2,
                        sizeGroupId: sizeGroupSlug
                            ? knex('SizeGroup').select('id').where('slug', sizeGroupSlug)
                            : null,
                        parentId: m.parentId,
                    })
                    .returning('id'),
            );
            // add children to queue
            queue.push({ parentId: id, children: category.children, parent: category });
        }
    }
};
