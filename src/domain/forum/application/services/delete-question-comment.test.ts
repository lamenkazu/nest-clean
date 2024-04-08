//Factories
import { makeQuestionComment } from "test/factories/make-question-comment";

import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { DeleteQuestionCommentService } from "./delete-question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";

let inMemoryStudentsRepo: InMemoryStudentRepository;
let inMemoryQuestionCommentsRepo: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentService;

describe("Delete Question Comment", () => {
  beforeEach(() => {
    inMemoryStudentsRepo = new InMemoryStudentRepository();

    inMemoryQuestionCommentsRepo = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepo
    );

    sut = new DeleteQuestionCommentService(inMemoryQuestionCommentsRepo);
  });

  it("should be able to delete a question comment", async () => {
    const questionComment = makeQuestionComment();

    await inMemoryQuestionCommentsRepo.create(questionComment);

    expect(inMemoryQuestionCommentsRepo.items).toHaveLength(1);

    await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    });

    expect(inMemoryQuestionCommentsRepo.items).toHaveLength(0);
  });

  it("should not be able to delete another user question comment", async () => {
    const testAuthorId = "author-01";
    const testOtherUserId = "author-02";

    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId(testAuthorId),
    });

    await inMemoryQuestionCommentsRepo.create(questionComment);

    const result = await sut.execute({
      authorId: testOtherUserId,
      questionCommentId: questionComment.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
