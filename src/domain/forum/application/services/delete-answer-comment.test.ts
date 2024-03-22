//Factories
import { makeAnswerComment } from "test/factories/make-answer-comment";

import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { DeleteAnswerCommentService } from "./delete-answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

let inMemoryAnswerCommentsRepo: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentService;

describe("Delete Answer Comment", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepo = new InMemoryAnswerCommentsRepository();

    sut = new DeleteAnswerCommentService(inMemoryAnswerCommentsRepo);
  });

  it("should be able to delete a answer comment", async () => {
    const answerComment = makeAnswerComment();

    await inMemoryAnswerCommentsRepo.create(answerComment);

    expect(inMemoryAnswerCommentsRepo.items).toHaveLength(1);

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    });

    expect(inMemoryAnswerCommentsRepo.items).toHaveLength(0);
  });

  it("should not be able to delete another user answer comment", async () => {
    const testAuthorId = "author-01";
    const testOtherUserId = "author-02";

    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId(testAuthorId),
    });

    await inMemoryAnswerCommentsRepo.create(answerComment);

    const result = await sut.execute({
      authorId: testOtherUserId,
      answerCommentId: answerComment.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
