import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

/**
 * Idempotency Key storage entity
 * Prevents duplicate webhook processing using idempotency keys
 */
export class PaymentIdempotencyKey {
  id: string;
  reference: string; // Payment reference
  gateway: string; // Payment gateway (flutterwave, paystack, etc.)
  idempotencyKey: string; // UUID or unique identifier
  result: Record<string, any>; // Cached result of processing
  createdAt: Date;
  expiresAt: Date; // Keys expire after 24 hours

  constructor(data: Partial<PaymentIdempotencyKey>) {
    Object.assign(this, data);
  }
}

/**
 * Payment Idempotency Service
 * Ensures that duplicate webhook events don't process payments twice
 * Uses a simple in-memory store (in production, use Redis)
 */
@Injectable()
export class PaymentIdempotencyService {
  private readonly logger = new Logger(PaymentIdempotencyService.name);

  /**
   * In-memory store for idempotency keys
   * In production, this should use Redis for distributed systems
   */
  private idempotencyStore: Map<string, PaymentIdempotencyKey> = new Map();

  /**
   * Cleanup interval (every 1 hour) to remove expired keys
   */
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {
    this.startCleanupInterval();
  }

  /**
   * Check if a payment webhook has already been processed
   * @param reference Payment reference (tx_ref or reference)
   * @param gateway Payment gateway name
   * @returns Cached result if already processed, null if new
   */
  async getIfProcessed(
    reference: string,
    gateway: string,
  ): Promise<Record<string, any> | null> {
    const key = this.generateKey(reference, gateway);
    const cached = this.idempotencyStore.get(key);

    if (!cached) {
      return null;
    }

    // Check if key has expired
    if (new Date() > cached.expiresAt) {
      this.idempotencyStore.delete(key);
      this.logger.debug(`Idempotency key expired: ${reference}`);
      return null;
    }

    this.logger.debug(`Idempotency hit: ${reference} (${gateway})`);
    return cached.result;
  }

  /**
   * Store a processed payment result
   * @param reference Payment reference
   * @param gateway Payment gateway
   * @param result The result to cache
   * @param expiresInHours How long to keep the cache (default 24 hours)
   */
  async store(
    reference: string,
    gateway: string,
    result: Record<string, any>,
    expiresInHours: number = 24,
  ): Promise<void> {
    const key = this.generateKey(reference, gateway);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const idempotencyKey = new PaymentIdempotencyKey({
      reference,
      gateway,
      idempotencyKey: key,
      result,
      createdAt: new Date(),
      expiresAt,
    });

    this.idempotencyStore.set(key, idempotencyKey);
    this.logger.debug(
      `Idempotency key stored: ${reference} (expires in ${expiresInHours} hours)`,
    );
  }

  /**
   * Check if an order has duplicate payment references
   * @param reference Payment reference
   * @returns true if another order already has this reference
   */
  async hasDuplicateReference(reference: string): Promise<boolean> {
    const count = await this.orderRepo.count({
      where: { paymentRef: reference },
    });
    return count > 1;
  }

  /**
   * Cleanup expired idempotency keys
   */
  private startCleanupInterval(): void {
    // Run cleanup every 30 minutes
    this.cleanupInterval = setInterval(
      () => {
        const now = new Date();
        let cleanedCount = 0;

        for (const [key, value] of this.idempotencyStore.entries()) {
          if (now > value.expiresAt) {
            this.idempotencyStore.delete(key);
            cleanedCount++;
          }
        }

        if (cleanedCount > 0) {
          this.logger.debug(
            `Cleaned up ${cleanedCount} expired idempotency keys`,
          );
        }
      },
      30 * 60 * 1000,
    );
  }

  /**
   * Stop cleanup interval (call in onModuleDestroy)
   */
  stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Generate unique key for idempotency check
   */
  private generateKey(reference: string, gateway: string): string {
    return `${gateway}:${reference}`;
  }

  /**
   * Get current number of cached keys
   */
  getCacheSize(): number {
    return this.idempotencyStore.size;
  }

  /**
   * Clear all cached keys (use with caution)
   */
  clearCache(): void {
    this.idempotencyStore.clear();
    this.logger.warn('Idempotency cache cleared');
  }
}
