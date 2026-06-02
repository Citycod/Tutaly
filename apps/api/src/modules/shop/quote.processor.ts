import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { QuoteRequest, QuoteStatus } from './entities/order.entity';

/**
 * Quote Processor - Handles automated quote lifecycle tasks
 * - Auto-expire quotes that have passed their deadline
 * - Cleanup stale quotes
 */
@Injectable()
export class QuoteProcessor {
  private readonly logger = new Logger(QuoteProcessor.name);

  constructor(
    @InjectRepository(QuoteRequest)
    private readonly quoteRepo: Repository<QuoteRequest>,
  ) {}

  /**
   * Auto-expire quotes that have passed their deadline
   * Runs every 30 minutes
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleQuoteExpiration() {
    this.logger.debug('Running quote expiration check...');
    try {
      const now = new Date();

      // Find all pending/quoted quotes that have expired
      const expiredQuotes = await this.quoteRepo.find({
        where: [
          {
            status: QuoteStatus.PENDING,
            deadlineRequested: LessThan(now),
          },
          {
            status: QuoteStatus.QUOTED,
            expiresAt: LessThan(now),
          },
        ],
      });

      if (expiredQuotes.length === 0) {
        return;
      }

      // Mark as expired
      for (const quote of expiredQuotes) {
        quote.status = QuoteStatus.EXPIRED;
        await this.quoteRepo.save(quote);
        this.logger.debug(`Quote ${quote.id} marked as expired`);
      }

      this.logger.log(`Auto-expired ${expiredQuotes.length} quotes`);
    } catch (error) {
      this.logger.error('Quote expiration failed:', error);
    }
  }

  /**
   * Auto-convert accepted quotes to orders
   * If a quote is accepted, create an order from it
   */
  async autoConvertAcceptedQuote(quoteId: string) {
    try {
      const quote = await this.quoteRepo.findOne({
        where: { id: quoteId },
        relations: ['product', 'buyer', 'seller'],
      });

      if (!quote) {
        throw new Error(`Quote ${quoteId} not found`);
      }

      if (quote.status !== QuoteStatus.ACCEPTED) {
        throw new Error(`Quote ${quoteId} is not in ACCEPTED status`);
      }

      /**
       * TODO: Implement quote-to-order conversion
       * This should:
       * 1. Create an Order entity from the quote
       * 2. Set order amount to quotedPrice
       * 3. Calculate commission (20%) and seller earnings (80%)
       * 4. Generate checkout link or payment link
       * 5. Notify buyer to proceed with payment
       */

      this.logger.log(`Quote ${quoteId} converted to order (TODO: implement)`);
    } catch (error) {
      this.logger.error(`Quote conversion failed for ${quoteId}:`, error);
      throw error;
    }
  }

  /**
   * Generate checkout link for quoted order
   * Creates a pre-filled checkout that the buyer can complete
   */
  async generateCheckoutLink(quoteId: string): Promise<string> {
    try {
      const quote = await this.quoteRepo.findOne({
        where: { id: quoteId },
        relations: ['product'],
      });

      if (!quote || !quote.quotedPrice) {
        throw new Error('Quote not found or price not set');
      }

      /**
       * TODO: Implement checkout link generation
       * This should:
       * 1. Create a temporary order with quote reference
       * 2. Generate a checkout URL with pre-filled quote data
       * 3. Return the URL to the buyer
       */

      return `${process.env.WEB_URL}/checkout?quoteId=${quoteId}`;
    } catch (error) {
      this.logger.error(
        `Checkout link generation failed for ${quoteId}:`,
        error,
      );
      throw error;
    }
  }
}
