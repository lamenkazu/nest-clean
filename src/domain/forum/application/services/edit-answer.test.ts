import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { EditAnswerService } from "./edit-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachsRepo: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepo: InMemoryAnswersRepository;
let sut: EditAnswerService;

describe("Edit Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachsRepo = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepo = new InMemoryAnswersRepository(
      inMemoryAnswerAttachsRepo
    );
    sut = new EditAnswerService(inMemoryAnswersRepo, inMemoryAnswerAttachsRepo);
  });

  it("should be able to edit a answer by id", async () => {
    const testAnswerId = "answer-id-1";
    const testAuthorId = "author-id-1";

    const testAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId(testAuthorId),
      },
      new UniqueEntityId(testAnswerId)
    );

    await inMemoryAnswersRepo.create(testAnswer);

    inMemoryAnswerAttachsRepo.items.push(
      makeAnswerAttachment({
        answerId: testAnswer.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      makeAnswerAttachment({
        answerId: testAnswer.id,
        attachmentId: new UniqueEntityId("2"),
      })
    );

    await sut.execute({
      authorId: testAuthorId,
      answerId: testAnswer.id.toValue(),
      content: "Conteúdo teste",
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryAnswersRepo.items[0]).toMatchObject({
      content: "Conteúdo teste",
    });

    expect(inMemoryAnswersRepo.items[0].attachments.currentItems).toHaveLength(
      2
    );

    expect(inMemoryAnswersRepo.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
    ]);
  });

  it("should not be able to edit a answer from another user", async () => {
    const testAnswerId = "answer-id-1";
    const testAuthorId = "author-id-1";
    const testOtherId = "author-id-2";

    const testAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId(testAuthorId),
      },
      new UniqueEntityId(testAnswerId)
    );

    await inMemoryAnswersRepo.create(testAnswer);

    const result = await sut.execute({
      authorId: testOtherId,
      answerId: testAnswer.id.toValue(),
      content: "Conteúdo teste",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
