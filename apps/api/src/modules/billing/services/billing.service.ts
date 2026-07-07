import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus, PaymentGateway } from '../entities/subscription.entity';
import { Invoice, InvoiceStatus } from '../entities/invoice.entity';
import { PaymentGatewayFactory } from '../../shop/gateways/payment-gateway.factory';
import { Currency } from '../../shop/entities/shop.entity';
import { Order } from '../../shop/entities/order.entity';
import { User } from '../../user/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly paymentGatewayFactory: PaymentGatewayFactory,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getCurrentSubscription(userId: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { employer: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    const invoices = await this.invoiceRepository.find({
      where: { employer: { id: userId } },
      order: { date: 'DESC' },
      take: 10,
    });

    return {
      subscription,
      invoices,
    };
  }

  async initializeSubscription(userId: string, planName: string, gatewayName: PaymentGateway, price: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const subscription = this.subscriptionRepository.create({
      employer: { id: userId },
      planName,
      price,
      status: SubscriptionStatus.PENDING_PAYMENT,
      paymentGateway: gatewayName,
    });
    
    const savedSub = await this.subscriptionRepository.save(subscription);
    
    const reference = `TUT-SUB-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    
    savedSub.paymentRef = reference;
    await this.subscriptionRepository.save(savedSub);

    const gateway = this.paymentGatewayFactory.createByName(gatewayName);

    const paymentResponse = await gateway.initializePayment({
      orders: [
        {
          id: savedSub.id,
          amountPaid: price,
          currency: Currency.NGN,
        } as unknown as Order,
      ],
      totalAmount: price,
      currency: Currency.NGN,
      customerEmail: user.email,
      customerName: user.username || 'Employer',
      redirectUrl: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/employer/billing?success=true&reference=${reference}`,
      reference,
      metadata: {
        payment_type: 'subscription',
        subscription_id: savedSub.id,
      },
    });

    return paymentResponse;
  }

  async confirmPayment(paymentRef: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { paymentRef },
      relations: ['employer'],
    });

    if (!subscription) throw new NotFoundException('Subscription not found');

    if (subscription.status === SubscriptionStatus.ACTIVE) {
      return subscription; // Already processed
    }

    subscription.status = SubscriptionStatus.ACTIVE;
    
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    subscription.currentPeriodStart = now;
    subscription.currentPeriodEnd = nextMonth;
    subscription.autoRenew = true;
    
    await this.subscriptionRepository.save(subscription);

    const invoice = this.invoiceRepository.create({
      subscription: { id: subscription.id },
      employer: { id: subscription.employer.id },
      amount: subscription.price,
      invoiceId: `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: now,
      status: InvoiceStatus.PAID,
      paymentRef,
    });
    
    await this.invoiceRepository.save(invoice);

    return subscription;
  }

  async cancelSubscription(userId: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { employer: { id: userId }, status: SubscriptionStatus.ACTIVE },
    });

    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    subscription.autoRenew = false;
    subscription.status = SubscriptionStatus.CANCELED;
    return this.subscriptionRepository.save(subscription);
  }
}
