import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { ShopProduct } from '../entities/shop.entity';
import { SeekerProfile } from '../../user/entities/seeker-profile.entity';
import {
  ProductPreviewDto,
  ProductDetailDto,
  ProductSearchDto,
  SearchQueryDto,
} from '../dto/week7.dto';

/**
 * Product Search Service
 * Handles browsing, filtering, full-text search, and product previews
 */
@Injectable()
export class ProductSearchService {
  private readonly logger = new Logger(ProductSearchService.name);

  constructor(
    @InjectRepository(ShopProduct)
    private readonly productRepo: Repository<ShopProduct>,
    @InjectRepository(SeekerProfile)
    private readonly profileRepo: Repository<SeekerProfile>,
  ) {}

  /**
   * Search products with advanced filtering
   */
  async searchProducts(query: SearchQueryDto): Promise<ProductSearchDto> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    let queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('seller.seekerProfile', 'profile')
      .leftJoinAndSelect('product.subcategory', 'subcategory')
      .where('product.is_active = true');

    // Full-text search on title and description
    if (query.q) {
      queryBuilder = queryBuilder.andWhere(
        '(product.title ILIKE :q OR product.description ILIKE :q)',
        { q: `%${query.q}%` },
      );
    }

    // Filter by category
    if (query.category) {
      queryBuilder = queryBuilder
        .leftJoinAndSelect('product.subcategory.category', 'category')
        .andWhere('category.id = :categoryId', { categoryId: query.category });
    }

    // Filter by subcategory
    if (query.subcategory) {
      queryBuilder = queryBuilder.andWhere(
        'product.subcategory_id = :subcategoryId',
        { subcategoryId: query.subcategory },
      );
    }

    // Filter by listing type
    if (query.listingType) {
      queryBuilder = queryBuilder.andWhere(
        'product.listing_type = :listingType',
        { listingType: query.listingType },
      );
    }

    // Filter by pricing type
    if (query.pricingType) {
      queryBuilder = queryBuilder.andWhere(
        'product.pricing_type = :pricingType',
        { pricingType: query.pricingType },
      );
    }

    // Filter by price range
    if (query.minPrice !== undefined) {
      queryBuilder = queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: query.minPrice,
      });
    }

    if (query.maxPrice !== undefined) {
      queryBuilder = queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: query.maxPrice,
      });
    }

    // Sorting
    const sortBy = query.sortBy || 'recent';
    switch (sortBy) {
      case 'featured':
        queryBuilder = queryBuilder
          .addOrderBy(
            'CASE WHEN product.featured_until > NOW() THEN 0 ELSE 1 END',
            'ASC',
          )
          .addOrderBy('product.featured_until', 'DESC')
          .addOrderBy('product.created_at', 'DESC');
        break;
      case 'popular':
        queryBuilder = queryBuilder.orderBy('product.download_count', 'DESC');
        break;
      case 'price_low':
        queryBuilder = queryBuilder.orderBy('product.price', 'ASC');
        break;
      case 'price_high':
        queryBuilder = queryBuilder.orderBy('product.price', 'DESC');
        break;
      case 'rating':
        queryBuilder = queryBuilder.orderBy('product.average_rating', 'DESC');
        break;
      case 'recent':
      default:
        queryBuilder = queryBuilder.orderBy('product.created_at', 'DESC');
    }

    const [products, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const items: ProductPreviewDto[] = products.map((p) =>
      this.mapProductToPreview(p),
    );

    return {
      items,
      total,
      page,
      limit,
      hasMore: skip + limit < total,
    };
  }

  /**
   * Get product detail view
   */
  async getProductDetail(productId: string): Promise<ProductDetailDto> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: [
        'seller',
        'seller.seekerProfile',
        'subcategory',
        'subcategory.category',
      ],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const totalOrders = 0; // TODO: Query from orders table

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      currency: product.currency,
      minQuantity: product.minQuantity,
      images: product.imageUrls,
      pricingType: product.pricingType,
      listingType: product.listingType,
      seller: {
        id: product.seller.id,
        email: product.seller.email,
        name:
          (product.seller.seekerProfile?.firstName || '') +
          ' ' +
          (product.seller.seekerProfile?.lastName || ''),
        username: product.seller.email.split('@')[0],
        avatar: product.seller.seekerProfile?.avatarUrl,
        rating: 4.8, // TODO: Calculate from ratings
        totalOrders,
      },
      rating: product.averageRating,
      totalRatings: product.totalRatings,
      ratingDistribution: product.ratingDistribution || {},
      isFeatured: !!(
        product.featuredUntil && product.featuredUntil > new Date()
      ),
      featuredUntil: product.featuredUntil || undefined,
      category: product.subcategory?.category?.name || 'Uncategorized',
      subcategory: product.subcategory?.name || 'Other',
    };
  }

  /**
   * Get quick preview for modal
   */
  async getProductPreview(productId: string): Promise<ProductPreviewDto> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['seller', 'seller.seekerProfile'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.mapProductToPreview(product);
  }

  /**
   * Map product entity to preview DTO
   */
  private mapProductToPreview(product: ShopProduct): ProductPreviewDto {
    return {
      id: product.id,
      title: product.title,
      thumbnail: product.imageUrls?.[0],
      price: product.price,
      currency: product.currency,
      rating: product.averageRating || 0,
      ratingCount: product.totalRatings || 0,
      sellerName:
        (product.seller?.seekerProfile?.firstName || '') +
        ' ' +
        (product.seller?.seekerProfile?.lastName || ''),
      sellerUsername: product.seller?.email?.split('@')[0] || 'Unknown',
      isFeatured: !!(
        product.featuredUntil && product.featuredUntil > new Date()
      ),
    };
  }

  /**
   * Get featured products for homepage
   */
  async getFeaturedProducts(limit: number = 12): Promise<ProductPreviewDto[]> {
    const now = new Date();

    const products = await this.productRepo.find({
      where: {
        isActive: true,
        featuredUntil: MoreThan(now),
      },
      relations: ['seller', 'seller.seekerProfile'],
      order: { featuredUntil: 'DESC' },
      take: limit,
    });

    return products.map((p) => this.mapProductToPreview(p));
  }

  /**
   * Get products by category with featured prioritization
   */
  async getProductsByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ProductSearchDto> {
    return this.searchProducts({
      category: categoryId,
      sortBy: 'featured',
      page,
      limit,
    });
  }

  /**
   * Get trending products (by download count)
   */
  async getTrendingProducts(limit: number = 12): Promise<ProductPreviewDto[]> {
    const products = await this.productRepo.find({
      where: { isActive: true },
      relations: ['seller', 'seller.seekerProfile'],
      order: { downloadCount: 'DESC' },
      take: limit,
    });

    return products.map((p) => this.mapProductToPreview(p));
  }

  /**
   * Full-text search on PostgreSQL using ILIKE
   * For production, integrate with PostgreSQL's full-text search (tsvector)
   */
  async fullTextSearch(
    searchTerm: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ProductSearchDto> {
    return this.searchProducts({
      q: searchTerm,
      page,
      limit,
    });
  }
}
