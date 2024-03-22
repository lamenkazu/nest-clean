import { makeAnswer } from "test/factories/make-answer";
import { OnAnswerCreated } from "./on-answer-created";
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
import { makeQuestion } from "test/factories/make-question";
import { MockInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";
import { OnCommentedQuestion } from "./on-commented-question";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";

let inMemoryNotificationRepo: InMemoryNotificationRepository;
let inMemoryQuestionAttachsRepo: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionCommentsRepo: InMemoryQuestionCommentsRepository;
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
    inMemoryQuestionAttachsRepo = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepo = new InMemoryQuestionRepository(
      inMemoryQuestionAttachsRepo
    );

    inMemoryQuestionCommentsRepo = new InMemoryQuestionCommentsRepository();

    inMemoryNotificationRepo = new InMemoryNotificationRepository();
    sendNotificationService = new SendNotificationService(
      inMemoryNotificationRepo
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationService, "execute");

    new OnCommentedQuestion(
      inMemoryQuestionCommentsRepo,
      sendNotificationService
    );
  });

  it("should send a notification when a question is commented", async () => {
    const question = makeQuestion();
    const questionComment = makeQuestionComment({ questionId: question.id });

    inMemoryQuestionsRepo.create(question);
    inMemoryQuestionCommentsRepo.create(questionComment);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
