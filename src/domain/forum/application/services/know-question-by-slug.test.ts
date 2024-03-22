import { InMemoryQuestionRepository } from "test/repositories/in-memory-questions-repository";
import { KnowQuestionBySlugService } from "./know-question-by-slug";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepo: InMemoryQuestionRepository;
let inMemoryQuestionAttachsRepo: InMemoryQuestionAttachmentsRepository;
let sut: KnowQuestionBySlugService;

describe("Know Question By Slug", () => {
  beforeEach(() => {
    inMemoryQuestionAttachsRepo = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepo = new InMemoryQuestionRepository(
      inMemoryQuestionAttachsRepo
    );
    sut = new KnowQuestionBySlugService(inMemoryQuestionsRepo);
  });

  it("should be able to know a question by slug", async () => {
    const testQuestion = makeQuestion({
      title: "Example Question",
    });

    await inMemoryQuestionsRepo.create(testQuestion);

    const result = await sut.execute({
      slug: "example-question",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionsRepo.items[0].title).toEqual("Example Question");
  });
});
