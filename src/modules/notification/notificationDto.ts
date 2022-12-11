import { notifications_types } from '../entities/notifications.entity';

export class CreateNotificationDto {
  userId: number;
  type: notifications_types;
  message: string;
  eventId: number;
  parentId: number | null;
}
