import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../user/entities/user.entity';
import { Job } from '../job/entities/job.entity';
import { Order } from '../shop/entities/order.entity';
import { SellerApplication } from '../support/entities/support.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Job, Order, SellerApplication])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
