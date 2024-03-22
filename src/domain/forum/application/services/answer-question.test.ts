import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerQuestionService } from "./answer-question";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachsRepo: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepo: InMemoryAnswersRepository;
let sut: AnswerQuestionService;

describe("Answer Question", () => {
  beforeEach(() => {
    inMemoryAnswerAttachsRepo = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepo = new InMemoryAnswersRepository(
      inMemoryAnswerAttachsRepo
    );
    sut = new AnswerQuestionService(inMemoryAnswersRepo);
  });

  it.only("should be able to create an answer", async () => {
    const result = await sut.execute({
      content: "Nova resposta",
      instructorId: "1",
      questionId: "1",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswersRepo.items[0]).toEqual(result.value?.answer);

    expect(inMemoryAnswersRepo.items[0].attachments.currentItems).toHaveLength(
      2
    );
    expect(inMemoryAnswersRepo.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
    ]);
  });
});
