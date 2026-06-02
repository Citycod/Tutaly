import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopProduct } from '../entities/shop.entity';
import { Order, OrderStatus } from '../entities/order.entity';
import { User } from '../../user/entities/user.entity';
import { SeekerProfile, SellerPlan } from '../../user/entities/seeker-profile.entity';
import { PaymentGatewayFactory } from '../gateways/payment-gateway.factory';
import { PaymentAuditService } from './payment-audit.service';
import { FeatureListingDto, FeatureListingResponseDto } from '../dto/week7.dto';

// Featured listing pricing tiers
const FEATURE_PRICING: Record<number, number> = {
  7: 5000, // 5000 NGN for 7 days
  30: 15000, // 15000 NGN for 30 days
  90: 35000, // 35000 NGN for 90 days
};

/**
 * Featured Listings Service
 * Manages product boosting, pricing, and featured status
 */
@Injectable()
export class FeaturedListingsService {
  private readonly logger = new Logger(FeaturedListingsService.name);

  constructor(
    @InjectRepository(ShopProduct)
    private readonly productRepo: Repository<ShopProduct>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(SeekerProfile)
    private readonly profileRepo: Repository<SeekerProfile>,
    private readonly paymentGatewayFactory: PaymentGatewayFactory,
    private readonly paymentAuditService: PaymentAuditService,
  ) {}

  /**
   * Get feature listing pricing
   */
  getFeaturePricing(): Record<number, number> {
    return FEATURE_PRICING;
  }

  /**
   * Feature a product listing
   * Initiates payment and sets featured_until timestamp
   */
  async featureListing(
    productId: string,
    sellerId: string,
    dto: FeatureListingDto,
  ): Promise<FeatureListingResponseDto> {
    // Verify product exists and seller owns it
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.seller.id !== sellerId) {
      throw new ForbiddenException('Only the seller can feature this product');
    }

    // Validate duration
    if (!FEATURE_PRICING[dto.durationDays]) {
      throw new BadRequestException(
        `Invalid duration. Available: ${Object.keys(FEATURE_PRICING).join(', ')} days`,
      );
    }

    const price = FEATURE_PRICING[dto.durationDays];
    const gateway = dto.paymentGateway || 'flutterwave';

    // TODO: Initiate payment through gateway
    // After payment confirmation, set featured_until

    const featuredUntil = this.calculateFeaturedUntil(dto.durationDays);
    product.featuredUntil = featuredUntil;

    await this.productRepo.save(product);

    this.logger.log(
      `Product ${productId} featured for ${dto.durationDays} days by seller ${sellerId}`,
    );

    return {
      productId,
      featuredUntil,
      price,
      currency: 'NGN',
      durationDays: dto.durationDays,
    };
  }

  /**
   * Calculate featured_until date based on duration
   */
  private calculateFeaturedUntil(durationDays: number): Date {
    const until = new Date();
    until.setDate(until.getDate() + durationDays);
    return until;
  }

  /**
   * Get all currently featured products
   */
  async getFeaturedProducts(limit: number = 20): Promise<ShopProduct[]> {
    const now = new Date();

    return this.productRepo.find({
      where: {
        featuredUntil: `${ShopProduct}.featured_until > :now` as any,
        isActive: true,
      },
      relations: ['seller', 'seller.seekerProfile', 'subcategory'],
      order: { featuredUntil: 'DESC' },
      take: limit,
    });
  }

  /**
   * Clean up expired featured statuses
   * Should be called by a cron job
   */
  async cleanupExpiredFeatured(): Promise<number> {
    const now = new Date();

    const result = await this.productRepo.update(
      {
        featuredUntil: `${ShopProduct}.featured_until <= :now` as any,
      },
      { featuredUntil: null },
    );

    this.logger.debug(
      `Cleaned up ${result.affected} expired featured products`,
    );

    return result.affected || 0;
  }

  /**
   * Check if a product is currently featured
   */
  async isProductFeatured(productId: string): Promise<boolean> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      select: ['id', 'featuredUntil'],
    });

    if (!product) {
      return false;
    }

    if (!product.featuredUntil) {
      return false;
    }

    return product.featuredUntil > new Date();
  }

  /**
   * Get seller's featured products
   */
  async getSellerFeaturedProducts(sellerId: string): Promise<ShopProduct[]> {
    const now = new Date();

    return this.productRepo.find({
      where: {
        seller: { id: sellerId },
        featuredUntil: `${ShopProduct}.featured_until > :now` as any,
      },
      relations: ['subcategory'],
      order: { featuredUntil: 'DESC' },
    });
  }

  /**
   * Get discount for bulk featured listings (tier-based)
   * Premium sellers get discounts
   */
  async getSellerFeatureDiscount(sellerId: string): Promise<number> {
    const profile = await this.profileRepo.findOne({
      where: { user: { id: sellerId } },
    });

    if (!profile) {
      return 0;
    }

    // Discount tiers: free = 0%, basic = 5%, premium = 10%
    const discounts: Record<SellerPlan, number> = {
      [SellerPlan.FREE]: 0,
      [SellerPlan.BASIC]: 5,
      [SellerPlan.PREMIUM]: 10,
    };

    return discounts[profile.sellerPlan] || 0;
  }
}
