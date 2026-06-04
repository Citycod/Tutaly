import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { NotificationService } from './services/notification.service';
import { UserManagementService } from './services/user-management.service';
import { JobsModerationService } from './services/jobs-moderation.service';
import { ReviewsModerationService } from './services/reviews-moderation.service';
import { SellersModerationService } from './services/sellers-moderation.service';
import { ReportsModerationService } from './services/reports-moderation.service';
import { DisputesResolutionService } from './services/disputes-resolution.service';
import { User } from '../user/entities/user.entity';
import { SeekerProfile } from '../user/entities/seeker-profile.entity';
import { EmployerProfile } from '../user/entities/employer-profile.entity';
import { Job } from '../job/entities/job.entity';
import { Order, OrderDispute } from '../shop/entities/order.entity';
import { SellerApplication } from '../support/entities/support.entity';
import { ShopProduct } from '../shop/entities/shop.entity';
import { CompanyReview } from '../review/entities/review.entity';
import { Post } from '../connect/entities/post.entity';
import { Report } from '../connect/entities/report.entity';
import { Notification } from './entities/notification.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      SeekerProfile,
      EmployerProfile,
      Job,
      Order,
      OrderDispute,
      SellerApplication,
      ShopProduct,
      CompanyReview,
      Post,
      Report,
      Notification,
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    NotificationService,
    UserManagementService,
    JobsModerationService,
    ReviewsModerationService,
    SellersModerationService,
    ReportsModerationService,
    DisputesResolutionService,
  ],
})
export class AdminModule {}
