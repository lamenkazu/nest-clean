import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerQuestionService } from "./answer-question";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { makeAnswer } from "test/factories/make-answer";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";

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

  it("should be able to create an answer", async () => {
    const result = await sut.execute({
      content: "Nova resposta",
      authorId: "1",
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

  it("should persist attachments when creating a new answer", async () => {
    const result = await sut.execute({
      authorId: "1",
      content: "Conteúdo da pergunta",
      attachmentsIds: ["1", "2"],
      questionId: "1",
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAnswerAttachsRepo.items).toHaveLength(2);
    expect(inMemoryAnswerAttachsRepo.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId("1"),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId("2"),
        }),
      ])
    );
  });
});
