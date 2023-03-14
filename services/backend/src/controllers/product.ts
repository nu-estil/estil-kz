import { Response } from 'express';
import {
    Authorized,
    Body,
    CurrentUser,
    Delete,
    Get,
    JsonController,
    Param,
    Post,
    Put,
    QueryParams,
    Res,
    UseBefore,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { singleton } from 'tsyringe';
import {
    CreateProductDto,
    GetBrandsDto,
    GetProductsParamDto,
    ToggleProductLike,
    UpdateProductDto,
} from '../dto/product';
import { ProductPreviewResponseDto } from '../dto/response/products';
import { jwtUserWithoutValidation } from '../middlewares';
import { ProductService } from '../services/product';
import { TJWTTokenPayload } from '../types';

@singleton()
@JsonController('/products')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get('/:userId/shop')
    getProducts(@Param('userId') userId: number, @QueryParams() params: GetProductsParamDto) {
        return this.productService.getProducts(userId, params);
    }

    @Get('/categories')
    getCategories() {
        return this.productService.getAggregatedCategories();
    }

    @Get('/attributes/size-groups')
    getSizeGroups() {
        return this.productService.getSizeGroups();
    }

    @Get('/attributes/colors')
    getColors() {
        return this.productService.getProductColors();
    }

    @Get('/brands')
    getBrands(@QueryParams() params: GetBrandsDto) {
        return this.productService.getBrands(params);
    }

    @Get('/conditions')
    getConditions() {
        return this.productService.getConditions();
    }

    @Authorized()
    @Get('/liked')
    getLikedProducts(@CurrentUser() user: TJWTTokenPayload) {
        return this.productService.getLikedProducts(user.userId);
    }

    @OpenAPI({ description: 'Get product by its slug' })
    @ResponseSchema(ProductPreviewResponseDto)
    @UseBefore(jwtUserWithoutValidation)
    @Get('/:slug')
    getProduct(@Param('slug') slug: string, @Res() res: Response) {
        return this.productService.getProduct(slug, res.locals.userPayload);
    }

    @Authorized()
    @Post('/')
    create(@CurrentUser() user: TJWTTokenPayload, @Body() data: CreateProductDto) {
        return this.productService.create(user, data);
    }

    @Authorized()
    @Put('/:id')
    update(
        @CurrentUser() user: TJWTTokenPayload,
        @Body() data: UpdateProductDto,
        @Param('id') id: number,
    ) {
        return this.productService.update(user, data, id);
    }

    @Authorized()
    @Delete('/:id')
    delete(@CurrentUser() user: TJWTTokenPayload, @Param('id') id: number) {
        return this.productService.delete(user, id);
    }

    @Authorized()
    @Post('/likes/toggle')
    toggleLike(@CurrentUser() user: TJWTTokenPayload, @Body() data: ToggleProductLike) {
        return this.productService.toggleLike(user, data);
    }
}
