import { InMemoryQuestionRepository } from "test/repositories/in-memory-questions-repository";
import { KnowQuestionBySlugService } from "./know-question-by-slug";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";
import { makeAttachment } from "test/factories/make-attachment";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryAttachsRepo: InMemoryAttachmentsRepository;
let inMemoryStudentsRepo: InMemoryStudentRepository;
let inMemoryQuestionsRepo: InMemoryQuestionRepository;
let inMemoryQuestionAttachsRepo: InMemoryQuestionAttachmentsRepository;
let sut: KnowQuestionBySlugService;

describe("Know Question By Slug", () => {
  beforeEach(() => {
    inMemoryQuestionAttachsRepo = new InMemoryQuestionAttachmentsRepository();
    inMemoryAttachsRepo = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepo = new InMemoryStudentRepository();

    inMemoryQuestionsRepo = new InMemoryQuestionRepository(
      inMemoryQuestionAttachsRepo,
      inMemoryAttachsRepo,
      inMemoryStudentsRepo
    );
    sut = new KnowQuestionBySlugService(inMemoryQuestionsRepo);
  });

  it("should be able to know a question by slug", async () => {
    const student = makeStudent({ name: "Jane Doe" });

    inMemoryStudentsRepo.items.push(student);

    const testQuestion = makeQuestion({
      title: "Example Question",
      authorId: student.id,
    });

    await inMemoryQuestionsRepo.create(testQuestion);

    const attachment = makeAttachment({
      title: "Some Attachment",
    });

    inMemoryAttachsRepo.items.push(attachment);

    inMemoryQuestionAttachsRepo.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: testQuestion.id,
      })
    );

    const result = await sut.execute({
      slug: "example-question",
    });

    expect(result.isRight()).toBe(true);

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: testQuestion.title,
        author: expect.objectContaining({
          name: "Jane Doe",
        }),
        attachments: [
          expect.objectContaining({
            title: "Some Attachment",
          }),
        ],
      }),
    });
  });
});
