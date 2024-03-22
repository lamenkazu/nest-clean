import { makeAnswerComment } from "test/factories/make-answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { FetchAnswerCommentsService } from "./fetch-answer-comments";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";

let inMemoryAnswerCommentsRepo: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsService;

describe("Fetch Answer Comments", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepo = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsService(inMemoryAnswerCommentsRepo);
  });

  it("should be able to fetch answer comments", async () => {
    const testAnswerId = "question-id-1";

    await inMemoryAnswerCommentsRepo.create(
      makeAnswerComment({
        answerId: new UniqueEntityId(testAnswerId),
      })
    );

    await inMemoryAnswerCommentsRepo.create(
      makeAnswerComment({
        answerId: new UniqueEntityId(testAnswerId),
      })
    );

    await inMemoryAnswerCommentsRepo.create(
      makeAnswerComment({
        answerId: new UniqueEntityId(testAnswerId),
      })
    );

    const result = await sut.execute({
      answerId: testAnswerId,
      page: 1,
    });

    expect(result.value?.answerComments).toHaveLength(3);
  });

  it("should be able to fetch paginted answer comments", async () => {
    const testAnswerId = "question-id-1";

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepo.create(
        makeAnswerComment({
          answerId: new UniqueEntityId(testAnswerId),
        })
      );
    }

    const page1 = await sut.execute({
      answerId: testAnswerId,
      page: 1,
    });

    expect(page1.value?.answerComments).toHaveLength(20);

    const page2 = await sut.execute({
      answerId: testAnswerId,
      page: 2,
    });

    expect(page2.value?.answerComments).toHaveLength(2);
  });
});
