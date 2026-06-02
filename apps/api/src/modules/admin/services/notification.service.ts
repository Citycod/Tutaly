import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Notification,
  NotificationType,
} from '../entities/notification.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
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
