//Factories
import { makeAnswer } from "test/factories/make-answer";

import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { CommentOnAnswerService } from "./comment-on-answer";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";

let inMemoryStudentsRepo: InMemoryStudentRepository;
let inMemoryAnswerAttachsRepo: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepo: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepo: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerService;

describe("Comment on Answer", () => {
  beforeEach(() => {
    inMemoryStudentsRepo = new InMemoryStudentRepository();

    inMemoryAnswerAttachsRepo = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepo = new InMemoryAnswersRepository(
      inMemoryAnswerAttachsRepo
    );
    inMemoryAnswerCommentsRepo = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepo
    );

    sut = new CommentOnAnswerService(
      inMemoryAnswersRepo,
      inMemoryAnswerCommentsRepo
    );
  });

  it("should be able to comment on answer", async () => {
    const answer = makeAnswer();

    await inMemoryAnswersRepo.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: "Comentário de teste",
    });

    expect(inMemoryAnswerCommentsRepo.items[0].content).toEqual(
      "Comentário de teste"
    );
  });
});
