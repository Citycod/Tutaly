import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import { FeaturedListingsService } from '../services/featured-listings.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { FeatureListingDto } from '../dto/week7.dto';

interface AuthenticatedRequest {
  user: { sub: string; email: string; role: string };
}

@Controller('shop')
export class FeaturedListingsController {
  constructor(private readonly featuredService: FeaturedListingsService) {}

  @Post('products/:id/feature')
  @UseGuards(JwtAuthGuard)
  async featureListing(
    @Param('id') productId: string,
    @NestRequest() req: AuthenticatedRequest,
    @Body() dto: FeatureListingDto,
  ) {
    return this.featuredService.featureListing(productId, req.user.sub, dto);
  }

  @Get('feature/pricing')
  async getFeaturePricing() {
    return this.featuredService.getFeaturePricing();
  }

  @Get('featured')
  async getFeaturedProducts(@Query('limit') limit?: string) {
    return this.featuredService.getFeaturedProducts(
      parseInt(limit || '20', 10),
    );
  }

  @Get('seller/featured')
  @UseGuards(JwtAuthGuard)
  async getSellerFeaturedProducts(@NestRequest() req: AuthenticatedRequest) {
    return this.featuredService.getSellerFeaturedProducts(req.user.sub);
  }
}
