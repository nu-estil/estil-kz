import { Body, Get, JsonController, Param, Post } from 'routing-controllers';
import { singleton } from 'tsyringe';
import { ProductDocumentDto, ProductSuggestionsDto } from '../../dto/products';
import { ProductService } from '../../services/products';

@singleton()
@JsonController('/private/products')
export class ProductPrivateController {
    constructor(private productService: ProductService) {}

    @Post('/')
    public saveProduct(@Body() product: ProductDocumentDto) {
        return this.productService.saveProduct(product);
    }

    @Get('/:id')
    public getProduct(@Param('id') id: number) {
        return this.productService.getProduct(id);
    }

    @Post('/suggestions')
    public async saveSuggestions(@Body() { suggestions }: ProductSuggestionsDto) {
        await this.productService.saveSuggestions(suggestions);
        return {};
    }
}
