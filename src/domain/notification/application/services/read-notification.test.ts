import { InMemoryNotificationRepository } from "test/repositories/in-memory-notifications-repository";
import { ReadNotificationService } from "./read-notification";
import { makeNotification } from "test/factories/make-notification";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

let inMemoryNotificationsRepo: InMemoryNotificationRepository;
let sut: ReadNotificationService;

describe("Read Notification", () => {
  beforeEach(() => {
    inMemoryNotificationsRepo = new InMemoryNotificationRepository();
    sut = new ReadNotificationService(inMemoryNotificationsRepo);
  });

  it("should be able to read a notification", async () => {
    const notification = makeNotification();
    await inMemoryNotificationsRepo.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryNotificationsRepo.items[0].readAt).toEqual(expect.any(Date));
  });

  it("should not be able to read a notification from another user", async () => {
    const testNotificationId = "notification-id-1";
    const testRecipientId = "recipient-id-1";
    const testOtherId = "recipient-id-2";

    const testNotification = makeNotification(
      {
        recipientId: new UniqueEntityId(testRecipientId),
      },
      new UniqueEntityId(testNotificationId)
    );

    await inMemoryNotificationsRepo.create(testNotification);

    const result = await sut.execute({
      recipientId: testOtherId,
      notificationId: testNotification.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
