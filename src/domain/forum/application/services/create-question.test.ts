import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { CreateQuestionService } from "./create-question";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepo: InMemoryQuestionRepository;
let inMemoryQuestionAttachsRepo: InMemoryQuestionAttachmentsRepository;
let sut: CreateQuestionService;

describe("Create Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachsRepo = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepo = new InMemoryQuestionRepository(
      inMemoryQuestionAttachsRepo
    );
    sut = new CreateQuestionService(inMemoryQuestionsRepo);
  });

  it("should be able to create a question", async () => {
    const result = await sut.execute({
      authorId: "1",
      title: "Nova pergunta",
      content: "Conteúdo da pergunta",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryQuestionsRepo.items[0]).toEqual(result.value?.question);
    expect(
      inMemoryQuestionsRepo.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(inMemoryQuestionsRepo.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
    ]);
  });
});
