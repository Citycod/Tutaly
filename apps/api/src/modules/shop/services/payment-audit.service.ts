import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentTransactionAudit } from '../entities/payment-audit.entity';
import { Order } from '../entities/order.entity';

/**
 * Payment Audit Service
 * Logs all payment transactions for compliance and debugging
 */
@Injectable()
export class PaymentAuditService {
  private readonly logger = new Logger(PaymentAuditService.name);

  constructor(
    @InjectRepository(PaymentTransactionAudit)
    private readonly auditRepo: Repository<PaymentTransactionAudit>,
  ) {}

  /**
   * Log a payment initialization attempt
   */
  async logPaymentInitiated(
    order: Order,
    gateway: string,
    reference: string,
    amount: number,
    currency: string,
    customerEmail: string,
  ): Promise<PaymentTransactionAudit> {
    const audit = this.auditRepo.create({
      order,
      gateway,
      reference,
      status: 'initiated',
      amount,
      currency,
      customerEmail,
    });

    await this.auditRepo.save(audit);
    this.logger.debug(
      `Payment initiated: ${gateway} - ${reference} - ${amount} ${currency}`,
    );
    return audit;
  }

  /**
   * Log a successful payment
   */
  async logPaymentSuccessful(
    order: Order,
    gateway: string,
    reference: string,
    gatewayResponse: Record<string, any>,
  ): Promise<PaymentTransactionAudit> {
    const audit = this.auditRepo.create({
      order,
      gateway,
      reference,
      status: 'successful',
      amount: Number(order.amountPaid),
      currency: order.currency,
      customerEmail: order.buyer?.email,
      gatewayResponse,
    });

    await this.auditRepo.save(audit);
    this.logger.log(
      `Payment successful: ${gateway} - ${reference} - Order ${order.id}`,
    );
    return audit;
  }

  /**
   * Log a failed payment
   */
  async logPaymentFailed(
    order: Order,
    gateway: string,
    reference: string,
    errorMessage: string,
    gatewayResponse?: Record<string, any>,
  ): Promise<PaymentTransactionAudit> {
    const audit = this.auditRepo.create({
      order,
      gateway,
      reference,
      status: 'failed',
      amount: Number(order.amountPaid),
      currency: order.currency,
      customerEmail: order.buyer?.email,
      errorMessage,
      gatewayResponse,
    });

    await this.auditRepo.save(audit);
    this.logger.error(
      `Payment failed: ${gateway} - ${reference} - ${errorMessage}`,
    );
    return audit;
  }

  /**
   * Log a webhook received
   */
  async logWebhookReceived(
    gateway: string,
    reference: string,
    payload: Record<string, any>,
  ): Promise<void> {
    this.logger.debug(`Webhook received: ${gateway} - ${reference}`, {
      payloadKeys: Object.keys(payload),
    });
  }

  /**
   * Get payment history for an order
   */
  async getOrderPaymentHistory(
    orderId: string,
  ): Promise<PaymentTransactionAudit[]> {
    return this.auditRepo.find({
      where: { order: { id: orderId } },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get failed payments for investigation
   */
  async getFailedPayments(
    limit: number = 100,
  ): Promise<PaymentTransactionAudit[]> {
    return this.auditRepo.find({
      where: { status: 'failed' },
      relations: ['order'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get successful payments in a date range
   */
  async getSuccessfulPaymentsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<PaymentTransactionAudit[]> {
    return this.auditRepo
      .createQueryBuilder('audit')
      .where('audit.status = :status', { status: 'successful' })
      .andWhere('audit.createdAt >= :startDate', { startDate })
      .andWhere('audit.createdAt <= :endDate', { endDate })
      .orderBy('audit.createdAt', 'DESC')
      .getMany();
  }
}
