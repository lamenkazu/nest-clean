import { DeleteAnswerService } from "./delete-answer";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";

import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

import { makeAnswer } from "test/factories/make-answer";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";

import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

let inMemoryAnswersRepo: InMemoryAnswersRepository;
let inMemoryAnswerAttachsRepo: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerService;

describe("Delete Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachsRepo = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepo = new InMemoryAnswersRepository(
      inMemoryAnswerAttachsRepo
    );
    sut = new DeleteAnswerService(inMemoryAnswersRepo);
  });

  it("should be able to delete a answer by id", async () => {
    const testAnswerId = "answer-id-1";
    const testAuthorId = "author-id-1";

    const testAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId(testAuthorId),
      },
      new UniqueEntityId(testAnswerId)
    );

    await inMemoryAnswersRepo.create(testAnswer);

    //Cria attachments para a resposta
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
      answerId: testAnswerId,
    });

    expect(inMemoryAnswersRepo.items).toHaveLength(0);
    expect(inMemoryAnswerAttachsRepo.items).toHaveLength(0);
  });

  it("should not be able to delete a answer from another user", async () => {
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
      answerId: testAnswerId,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
