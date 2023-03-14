import { singleton } from 'tsyringe';
import { ProductDocument } from '../types/documents/product';
import { ElasticService } from './ElasticService';

@singleton()
export class ProductService {
    constructor(private elasticService: ElasticService) {}

    private generateCategorySuggestions({ categories }: ProductDocument) {
        const categorySuggestions = categories.map(({ name }) => name);

        if (categories.length < 2) return categorySuggestions;

        /**
         * mens,
         * tops,
         * shirts,
         * mens tops,
         * mens shirts
         */
        const parentCategorySuggestions = categories
            .slice(1)
            .map(({ name }) => categories[0].name + ' ' + name);

        return [...categorySuggestions, ...parentCategorySuggestions];
    }

    private generateBrandSuggestions(product: ProductDocument) {
        const { brand } = product;

        if (!brand) return [];

        const { name } = brand;
        /**
         * jack&jones,
         * jack&jones mens,
         * jack&jones mens tops,
         * jack&jones tops,
         * jack&jones mens shirts,
         * jack&jones shirts
         */
        const brandCategorySuggestions = this.generateCategorySuggestions(product).map(
            (s) => name + ' ' + s,
        );

        return [name, ...brandCategorySuggestions];
    }

    private generateColorCategorySuggestions(product: ProductDocument) {
        const { colors } = product;

        const categorySuggestions = this.generateCategorySuggestions(product).slice(1);

        const suggests = colors.flatMap(({ title }) => [
            /**
             * tops blue,
             * shirts blue,
             * mens tops blue
             * mens shirts blue,
             */
            ...categorySuggestions.map((cs) => cs + ' ' + title),
            /**
             * blue tops,
             * blue shirts,
             * blue mens tops
             * blue mens shirts
             */
            ...categorySuggestions.map((cs) => title + ' ' + cs),
        ]);

        return suggests;
    }

    public async indexSearch(id: number) {
        // get product via api
        const product: ProductDocument = await this.elasticService.getProduct(id);

        const suggestions = [
            ...this.generateCategorySuggestions(product),
            ...this.generateBrandSuggestions(product),
            ...this.generateColorCategorySuggestions(product),
        ].map((s) => s.toLowerCase());

        await this.elasticService.saveSuggestions(suggestions);
    }
}
