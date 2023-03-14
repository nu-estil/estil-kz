import { Get, JsonController, QueryParam, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { singleton } from 'tsyringe';
import { GetProductsParamDto } from '../../dto/products';
import { ProductPreviewResponseDto } from '../../dto/response/products';
import { ProductService } from '../../services/products';

@singleton()
@JsonController('/public/products')
export class ProductPublicController {
    constructor(private productService: ProductService) {}

    @Get('/suggestions')
    public getSuggestions(@QueryParam('search', { required: true }) search: string) {
        return this.productService.getSuggestions(search);
    }

    @OpenAPI({ description: 'Get products list' })
    @ResponseSchema(ProductPreviewResponseDto)
    @Get('/')
    public getProducts(@QueryParams() filter: GetProductsParamDto) {
        return this.productService.getProducts(filter);
    }
}
