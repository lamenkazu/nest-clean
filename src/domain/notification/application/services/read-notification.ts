import { Either, left, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

interface ReadNotificationServiceRequest {
  notificationId: string;
  recipientId: string;
}

type ReadNotificationServiceResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    notification: Notification;
  }
>;

export class ReadNotificationService {
  constructor(private notificationRepo: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationServiceRequest): Promise<ReadNotificationServiceResponse> {
    const notification = await this.notificationRepo.findById(notificationId);

    if (!notification) return left(new ResourceNotFoundError());

    if (recipientId !== notification.recipientId.toString())
      return left(new NotAllowedError());

    notification.read();

    await this.notificationRepo.update(notification);

    return right({
      notification,
    });
  }
}
