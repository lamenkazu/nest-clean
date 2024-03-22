import { InMemoryNotificationRepository } from "test/repositories/in-memory-notifications-repository";
import { SendNotificationService } from "./send-notification";

let inMemoryNotificationsRepo: InMemoryNotificationRepository;
let sut: SendNotificationService;

describe("Send Notification", () => {
  beforeEach(() => {
    inMemoryNotificationsRepo = new InMemoryNotificationRepository();
    sut = new SendNotificationService(inMemoryNotificationsRepo);
  });

  it("should be able to send a notification", async () => {
    const result = await sut.execute({
      recipientId: "1",
      title: "Nova notificação",
      content: "Conteúdo da notificação",
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryNotificationsRepo.items[0]).toEqual(
      result.value?.notification
    );
  });
});
