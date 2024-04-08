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
import { makeQuestion } from "test/factories/make-question";
import { MockInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryAttachsRepo: InMemoryAttachmentsRepository;
let inMemoryStudentsRepo: InMemoryStudentRepository;
let inMemoryNotificationRepo: InMemoryNotificationRepository;
let inMemoryQuestionAttachsRepo: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepo: InMemoryQuestionRepository;
let sendNotificationService: SendNotificationService;
let inMemoryAnswerAttachsRepo: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepo: InMemoryAnswersRepository;

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationServiceRequest],
  Promise<SendNotificationServiceResponse>
>;

describe("On Question Best Answer Chosen", () => {
  beforeEach(() => {
    inMemoryQuestionAttachsRepo = new InMemoryQuestionAttachmentsRepository();
    inMemoryAttachsRepo = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepo = new InMemoryStudentRepository();

    inMemoryQuestionsRepo = new InMemoryQuestionRepository(
      inMemoryQuestionAttachsRepo,
      inMemoryAttachsRepo,
      inMemoryStudentsRepo
    );

    inMemoryAnswerAttachsRepo = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepo = new InMemoryAnswersRepository(
      inMemoryAnswerAttachsRepo
    );

    inMemoryNotificationRepo = new InMemoryNotificationRepository();
    sendNotificationService = new SendNotificationService(
      inMemoryNotificationRepo
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationService, "execute");

    new OnQuestionBestAnswerChosen(
      inMemoryAnswersRepo,
      sendNotificationService
    );
  });

  it("should send a notification when question has new best answer", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    inMemoryQuestionsRepo.create(question);
    inMemoryAnswersRepo.create(answer);

    question.bestAnswerId = answer.id;

    inMemoryQuestionsRepo.update(question);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
