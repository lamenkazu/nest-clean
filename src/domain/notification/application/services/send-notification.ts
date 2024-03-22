import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Either, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";

export interface SendNotificationServiceRequest {
  recipientId: string;
  title: string;
  content: string;
}

export type SendNotificationServiceResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

export class SendNotificationService {
  constructor(private notificationRepo: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationServiceRequest): Promise<SendNotificationServiceResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    });

    await this.notificationRepo.create(notification);

    return right({
      notification,
    });
  }
}
