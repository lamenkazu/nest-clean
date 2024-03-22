import { InMemoryQuestionRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { EditQuestionService } from "./edit-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepo: InMemoryQuestionRepository;
let inMemoryQuestionAttachsRepo: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionService;

describe("Edit Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachsRepo = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepo = new InMemoryQuestionRepository(
      inMemoryQuestionAttachsRepo
    );
    sut = new EditQuestionService(
      inMemoryQuestionsRepo,
      inMemoryQuestionAttachsRepo
    );
  });

  it("should be able to edit a question by id", async () => {
    const testQuestionId = "question-id-1";
    const testAuthorId = "author-id-1";

    const testQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId(testAuthorId),
      },
      new UniqueEntityId(testQuestionId)
    );

    await inMemoryQuestionsRepo.create(testQuestion);

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
      questionId: testQuestion.id.toValue(),
      title: "Pergunta teste",
      content: "Conteúdo teste",
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryQuestionsRepo.items[0]).toMatchObject({
      title: "Pergunta teste",
      content: "Conteúdo teste",
    });

    expect(
      inMemoryQuestionsRepo.items[0].attachments.currentItems
    ).toHaveLength(2);

    expect(inMemoryQuestionsRepo.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
    ]);
  });

  it("should not be able to edit a question from another user", async () => {
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
      questionId: testQuestion.id.toValue(),
      title: "Pergunta teste",
      content: "Conteúdo teste",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
