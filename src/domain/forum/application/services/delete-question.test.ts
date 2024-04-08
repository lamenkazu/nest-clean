import { InMemoryQuestionRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { DeleteQuestionService } from "./delete-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryAttachsRepo: InMemoryAttachmentsRepository;
let inMemoryStudentsRepo: InMemoryStudentRepository;
let inMemoryQuestionsRepo: InMemoryQuestionRepository;
let inMemoryQuestionAttachsRepo: InMemoryQuestionAttachmentsRepository;
let sut: DeleteQuestionService;

describe("Delete Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachsRepo = new InMemoryQuestionAttachmentsRepository();
    inMemoryAttachsRepo = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepo = new InMemoryStudentRepository();

    inMemoryQuestionsRepo = new InMemoryQuestionRepository(
      inMemoryQuestionAttachsRepo,
      inMemoryAttachsRepo,
      inMemoryStudentsRepo
    );
    sut = new DeleteQuestionService(inMemoryQuestionsRepo);
  });

  it("should be able to delete a question by id", async () => {
    const testQuestionId = "question-id-1";
    const testAuthorId = "author-id-1";

    const testQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId(testAuthorId),
      },
      new UniqueEntityId(testQuestionId)
    );

    await inMemoryQuestionsRepo.create(testQuestion);

    //Cria attachments para a questão
    inMemoryQuestionAttachsRepo.items.push(
      makeQuestionAttachment({
        questionId: testQuestion.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      makeQuestionAttachment({
        questionId: testQuestion.id,
        attachmentId: new UniqueEntityId("2"),
      })
    );

    await sut.execute({
      authorId: testAuthorId,
      questionId: testQuestionId,
    });

    expect(inMemoryQuestionsRepo.items).toHaveLength(0);
    expect(inMemoryQuestionAttachsRepo.items).toHaveLength(0);
  });

  it("should not be able to delete a question from another user", async () => {
    const testQuestionId = "question-id-1";
    const testAuthorId = "author-id-1";
    const testOtherId = "author-id-2";

    const testQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId(testAuthorId),
      },
      new UniqueEntityId(testQuestionId)
    );

    await inMemoryQuestionsRepo.create(testQuestion);

    const result = await sut.execute({
      authorId: testOtherId,
      questionId: testQuestionId,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
