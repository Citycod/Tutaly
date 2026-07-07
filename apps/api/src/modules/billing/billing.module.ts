import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Invoice } from './entities/invoice.entity';
import { BillingService } from './services/billing.service';
import { BillingController } from './controllers/billing.controller';
import { ShopModule } from '../shop/shop.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, Invoice]),
    ShopModule,
    UserModule,
    AuthModule,
  ],
  providers: [BillingService],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}
