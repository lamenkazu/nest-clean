//Factories
import { makeQuestion } from "test/factories/make-question";

import { InMemoryQuestionRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { CommentOnQuestionService } from "./comment-on-question";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionAttachsRepo: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepo: InMemoryQuestionRepository;
let inMemoryQuestionCommentsRepo: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionService;

describe("Comment on Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachsRepo = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepo = new InMemoryQuestionRepository(
      inMemoryQuestionAttachsRepo
    );
    inMemoryQuestionCommentsRepo = new InMemoryQuestionCommentsRepository();

    sut = new CommentOnQuestionService(
      inMemoryQuestionsRepo,
      inMemoryQuestionCommentsRepo
    );
  });

  it("should be able to comment on question", async () => {
    const question = makeQuestion();

    await inMemoryQuestionsRepo.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: "Comentário de teste",
    });

    expect(inMemoryQuestionCommentsRepo.items[0].content).toEqual(
      "Comentário de teste"
    );
  });
});
