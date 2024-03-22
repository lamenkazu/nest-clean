import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { FetchQuestionAnswersService } from "./fetch-question-answers";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachsRepo: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepo: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersService;

describe("Fetch Question Answers", () => {
  beforeEach(() => {
    inMemoryAnswerAttachsRepo = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepo = new InMemoryAnswersRepository(
      inMemoryAnswerAttachsRepo
    );
    sut = new FetchQuestionAnswersService(inMemoryAnswersRepo);
  });

  it("should be able to fetch question answers", async () => {
    const testQuestionId = "question-id-1";

    await inMemoryAnswersRepo.create(
      makeAnswer({
        questionId: new UniqueEntityId(testQuestionId),
      })
    );

    await inMemoryAnswersRepo.create(
      makeAnswer({
        questionId: new UniqueEntityId(testQuestionId),
      })
    );

    await inMemoryAnswersRepo.create(
      makeAnswer({
        questionId: new UniqueEntityId(testQuestionId),
      })
    );

    const result = await sut.execute({
      questionId: testQuestionId,
      page: 1,
    });

    expect(result.value?.answers).toHaveLength(3);
  });

  it("should be able to fetch paginted question answers", async () => {
    const testQuestionId = "question-id-1";

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepo.create(
        makeAnswer({
          questionId: new UniqueEntityId(testQuestionId),
        })
      );
    }

    const page1 = await sut.execute({
      questionId: testQuestionId,
      page: 1,
    });

    expect(page1.value?.answers).toHaveLength(20);

    const page2 = await sut.execute({
      questionId: testQuestionId,
      page: 2,
    });

    expect(page2.value?.answers).toHaveLength(2);
  });
});
