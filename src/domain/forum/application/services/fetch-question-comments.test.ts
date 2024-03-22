import { makeQuestionComment } from "test/factories/make-question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { FetchQuestionCommentsService } from "./fetch-question-comments";

let inMemoryQuestionCommentsRepo: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsService;

describe("Fetch Question Comments", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepo = new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsService(inMemoryQuestionCommentsRepo);
  });

  it("should be able to fetch question comments", async () => {
    const testQuestionId = "question-id-1";

    await inMemoryQuestionCommentsRepo.create(
      makeQuestionComment({
        questionId: new UniqueEntityId(testQuestionId),
      })
    );

    await inMemoryQuestionCommentsRepo.create(
      makeQuestionComment({
        questionId: new UniqueEntityId(testQuestionId),
      })
    );

    await inMemoryQuestionCommentsRepo.create(
      makeQuestionComment({
        questionId: new UniqueEntityId(testQuestionId),
      })
    );

    const result = await sut.execute({
      questionId: testQuestionId,
      page: 1,
    });

    expect(result.value?.questionComments).toHaveLength(3);
  });

  it("should be able to fetch paginted question questionComments", async () => {
    const testQuestionId = "question-id-1";

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepo.create(
        makeQuestionComment({
          questionId: new UniqueEntityId(testQuestionId),
        })
      );
    }

    const page1 = await sut.execute({
      questionId: testQuestionId,
      page: 1,
    });

    expect(page1.value?.questionComments).toHaveLength(20);

    const page2 = await sut.execute({
      questionId: testQuestionId,
      page: 2,
    });

    expect(page2.value?.questionComments).toHaveLength(2);
  });
});
