import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import {
  SendNotificationService,
  SendNotificationServiceRequest,
  SendNotificationServiceResponse,
} from "../services/send-notification";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryNotificationRepository } from "test/repositories/in-memory-notifications-repository";
import { MockInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";
import { OnCommentedAnswer } from "./on-commented-answer";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { makeAnswerComment } from "test/factories/make-answer-comment";

let inMemoryNotificationRepo: InMemoryNotificationRepository;
let inMemoryQuestionAttachsRepo: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswerCommentsRepo: InMemoryAnswerCommentsRepository;
let inMemoryQuestionsRepo: InMemoryQuestionRepository;
let sendNotificationService: SendNotificationService;
let inMemoryAnswerAttachsRepo: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepo: InMemoryAnswersRepository;

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationServiceRequest],
  Promise<SendNotificationServiceResponse>
>;

describe("On Commented Question", () => {
  beforeEach(() => {
    inMemoryAnswerAttachsRepo = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepo = new InMemoryAnswersRepository(
      inMemoryAnswerAttachsRepo
    );

    inMemoryAnswerCommentsRepo = new InMemoryAnswerCommentsRepository();

    inMemoryNotificationRepo = new InMemoryNotificationRepository();
    sendNotificationService = new SendNotificationService(
      inMemoryNotificationRepo
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationService, "execute");

    new OnCommentedAnswer(inMemoryAnswerCommentsRepo, sendNotificationService);
  });

  it("should send a notification when a answer is commented", async () => {
    const answer = makeAnswer();
    const answerComment = makeAnswerComment({ answerId: answer.id });

    inMemoryAnswersRepo.create(answer);
    inMemoryAnswerCommentsRepo.create(answerComment);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
