import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Notification,
  NotificationType,
} from '../entities/notification.entity';

import { MailService } from '../../auth/mail.service';
import { UserSettings } from '../../user/entities/user-settings.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(UserSettings)
    private readonly settingsRepo: Repository<UserSettings>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    message: string,
    link?: string,
  ): Promise<Notification> {
    const notification = this.notificationRepo.create({
      user: { id: userId } as any,
      type,
      message,
      link,
    });
    return this.notificationRepo.save(notification);
  }

  async createAdNotification(
    userId: string,
    type: NotificationType,
    message: string,
    campaignId: string,
    extraData?: { reason?: string; amount?: number; reportHtml?: string },
  ): Promise<Notification | null> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return null;

    let settings = await this.settingsRepo.findOne({ where: { user: { id: userId } } });
    if (!settings) {
      settings = this.settingsRepo.create({ user, notifications: {} });
    }

    const link = `/dashboard/employer/advertise/${campaignId}`;
    const notification = this.notificationRepo.create({
      user: { id: userId } as any,
      type,
      message,
      link,
    });
    await this.notificationRepo.save(notification);

    const prefs = settings.notifications;

    if (type === NotificationType.AD_CAMPAIGN_CREATED && prefs.adCampaignStatusUpdates !== false) {
      await this.mailService.sendAdCampaignCreatedEmail(user.email, campaignId);
    } else if (type === NotificationType.AD_UNDER_REVIEW && prefs.adCampaignStatusUpdates !== false) {
      await this.mailService.sendAdUnderReviewEmail(user.email, campaignId);
    } else if (type === NotificationType.AD_APPROVED && prefs.adCampaignStatusUpdates !== false) {
      await this.mailService.sendAdApprovedEmail(user.email, campaignId);
    } else if (type === NotificationType.AD_REJECTED && prefs.adAdminMessages !== false) {
      await this.mailService.sendAdRejectedEmail(user.email, campaignId, extraData?.reason || '');
    } else if (type === NotificationType.AD_BUDGET_50 && prefs.adBudgetAlerts !== false) {
      await this.mailService.sendAdBudget50Email(user.email, campaignId);
    } else if (type === NotificationType.AD_BUDGET_80 && prefs.adBudgetAlerts !== false) {
      await this.mailService.sendAdBudget80Email(user.email, campaignId);
    } else if (type === NotificationType.AD_BUDGET_EXHAUSTED && prefs.adBudgetAlerts !== false) {
      await this.mailService.sendAdBudgetExhaustedEmail(user.email, campaignId);
    } else if (type === NotificationType.AD_CAMPAIGN_ENDED && prefs.adCampaignStatusUpdates !== false) {
      await this.mailService.sendAdCampaignEndedEmail(user.email, campaignId);
    } else if (type === NotificationType.AD_REFUND_PROCESSED && prefs.adRefundNotifications !== false) {
      await this.mailService.sendAdRefundProcessedEmail(user.email, campaignId, extraData?.amount || 0);
    } else if (type === NotificationType.AD_WEEKLY_REPORT && prefs.adWeeklyReports !== false) {
      await this.mailService.sendAdWeeklyReportEmail(user.email, extraData?.reportHtml || '');
    }

    return notification;
  }

  async getUserNotifications(userId: string, page = 1, limit = 10) {
    const [data, total] = await this.notificationRepo.findAndCount({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, meta: { page, limit, total } };
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.notificationRepo.update(
      { id: notificationId },
      { isRead: true },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepo.update(
      { user: { id: userId }, isRead: false },
      { isRead: true },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepo.count({
      where: { user: { id: userId }, isRead: false },
    });
  }
}
