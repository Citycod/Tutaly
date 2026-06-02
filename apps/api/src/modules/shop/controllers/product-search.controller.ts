import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductSearchService } from '../services/product-search.service';
import { SearchQueryDto } from '../dto/week7.dto';

@Controller('shop')
export class ProductSearchController {
  constructor(private readonly searchService: ProductSearchService) {}

  @Get('search')
  async searchProducts(@Query() query: SearchQueryDto) {
    return this.searchService.searchProducts(query);
  }

  @Get('products/:id/preview')
  async getProductPreview(@Param('id') productId: string) {
    return this.searchService.getProductPreview(productId);
  }

  @Get('products/:id/detail')
  async getProductDetail(@Param('id') productId: string) {
    return this.searchService.getProductDetail(productId);
  }

  @Get('trending')
  async getTrendingProducts(@Query('limit') limit?: string) {
    return this.searchService.getTrendingProducts(parseInt(limit || '12', 10));
  }

  @Get('category/:id/products')
  async getProductsByCategory(
    @Param('id') categoryId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.getProductsByCategory(
      categoryId,
      parseInt(page || '1', 10),
      parseInt(limit || '20', 10),
    );
  }

  @Get('featured-products')
  async getFeaturedProductsForHomepage() {
    return this.searchService.getFeaturedProducts(12);
  }
}
