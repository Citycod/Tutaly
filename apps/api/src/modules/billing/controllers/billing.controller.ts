import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { BillingService } from '../services/billing.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../user/entities/user.entity';

@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('subscription')
  @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
  async getCurrentSubscription(@Req() req) {
    return this.billingService.getCurrentSubscription(req.user.sub);
  }

  @Post('subscription/initialize')
  @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
  async initializeSubscription(@Req() req, @Body() body: any) {
    const { planName, gatewayName, price } = body;
    return this.billingService.initializeSubscription(
      req.user.sub,
      planName,
      gatewayName,
      price,
    );
  }

  @Post('subscription/confirm')
  @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
  async confirmSubscription(@Body() body: any) {
    const { paymentRef } = body;
    return this.billingService.confirmPayment(paymentRef);
  }

  @Post('subscription/cancel')
  @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
  async cancelSubscription(@Req() req) {
    return this.billingService.cancelSubscription(req.user.sub);
  }
}
