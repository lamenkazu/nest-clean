import { Notification } from "../../enterprise/entities/notification";

export interface NotificationsRepository {
  create(notification: Notification): Promise<void>;
  findById(id: string): Promise<Notification | null>;
  update(notification: Notification): Promise<void>;
}
