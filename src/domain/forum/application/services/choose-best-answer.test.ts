//Factories
import { makeAnswer } from "test/factories/make-answer";
import { makeQuestion } from "test/factories/make-question";

import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-questions-repository";
import { ChooseBestAnswerService } from "./choose-best-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryAnswerAttachsRepo: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionAttachsRepo: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepo: InMemoryQuestionRepository;
let inMemoryAnswersRepo: InMemoryAnswersRepository;
let sut: ChooseBestAnswerService;

describe("Choose Best Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachsRepo = new InMemoryAnswerAttachmentsRepository();
    inMemoryQuestionAttachsRepo = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepo = new InMemoryQuestionRepository(
      inMemoryQuestionAttachsRepo
    );
    inMemoryAnswersRepo = new InMemoryAnswersRepository(
      inMemoryAnswerAttachsRepo
    );

    sut = new ChooseBestAnswerService(
      inMemoryQuestionsRepo,
      inMemoryAnswersRepo
    );
  });

  it("should be able to choose the question best answer", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepo.create(question);
    await inMemoryAnswersRepo.create(answer);

    await sut.execute({
      questionAuthorId: question.authorId.toString(),
      answerId: answer.id.toString(),
    });

    expect(inMemoryQuestionsRepo.items[0].bestAnswerId).toEqual(answer.id);
  });

  it("should not be able to choose another user question best answer", async () => {
    const testAuthorId = "author-id-1";
    const testOtherId = "author-id-2";

    const question = makeQuestion({
      authorId: new UniqueEntityId(testAuthorId),
    });
    const answer = makeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepo.create(question);
    await inMemoryAnswersRepo.create(answer);

    const result = await sut.execute({
      questionAuthorId: testOtherId,
      answerId: answer.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
