import { InMemoryQuestionRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { KnowRecentQuestionsService } from "./know-recent-questions";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepo: InMemoryQuestionRepository;
let inMemoryQuestionAttachsRepo: InMemoryQuestionAttachmentsRepository;
let sut: KnowRecentQuestionsService;

describe("Know Recent Questions", () => {
  beforeEach(() => {
    inMemoryQuestionAttachsRepo = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepo = new InMemoryQuestionRepository(
      inMemoryQuestionAttachsRepo
    );
    sut = new KnowRecentQuestionsService(inMemoryQuestionsRepo);
  });

  it("should be able to fetch recent questions", async () => {
    await inMemoryQuestionsRepo.create(
      makeQuestion({ createdAt: new Date(2024, 0, 20) })
    );

    await inMemoryQuestionsRepo.create(
      makeQuestion({ createdAt: new Date(2024, 0, 18) })
    );

    await inMemoryQuestionsRepo.create(
      makeQuestion({ createdAt: new Date(2024, 0, 23) })
    );

    const result = await sut.execute({ page: 1 });

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 18) }),
    ]);
  });

  it("should be able to fetch recent paginted questions", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepo.create(makeQuestion());
    }

    const result = await sut.execute({ page: 2 });

    expect(result.value?.questions).toHaveLength(2);
  });
});
