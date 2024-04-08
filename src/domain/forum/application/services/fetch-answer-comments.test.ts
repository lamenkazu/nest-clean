import { makeAnswerComment } from "test/factories/make-answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { FetchAnswerCommentsService } from "./fetch-answer-comments";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryAnswerCommentsRepo: InMemoryAnswerCommentsRepository;
let inMemoryStudentRepo: InMemoryStudentRepository;
let sut: FetchAnswerCommentsService;

describe("Fetch Answer Comments", () => {
  beforeEach(() => {
    inMemoryStudentRepo = new InMemoryStudentRepository();
    inMemoryAnswerCommentsRepo = new InMemoryAnswerCommentsRepository(
      inMemoryStudentRepo
    );
    sut = new FetchAnswerCommentsService(inMemoryAnswerCommentsRepo);
  });

  it("should be able to fetch answer comments", async () => {
    const student = makeStudent({ name: "Jane Doe" });

    inMemoryStudentRepo.items.push(student);

    const testAnswerId = "question-id-1";

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityId(testAnswerId),
      authorId: student.id,
    });

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityId(testAnswerId),
      authorId: student.id,
    });

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityId(testAnswerId),
      authorId: student.id,
    });

    await inMemoryAnswerCommentsRepo.create(comment1);
    await inMemoryAnswerCommentsRepo.create(comment2);
    await inMemoryAnswerCommentsRepo.create(comment3);

    const result = await sut.execute({
      answerId: testAnswerId,
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: expect.objectContaining({ name: "Jane Doe" }),
          commentId: comment1.id,
        }),

        expect.objectContaining({
          author: expect.objectContaining({ name: "Jane Doe" }),
          commentId: comment2.id,
        }),

        expect.objectContaining({
          author: expect.objectContaining({ name: "Jane Doe" }),
          commentId: comment3.id,
        }),
      ])
    );
  });

  it("should be able to fetch paginted answer comments", async () => {
    const student = makeStudent({ name: "Jane Doe" });

    inMemoryStudentRepo.items.push(student);

    const testAnswerId = "question-id-1";

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepo.create(
        makeAnswerComment({
          answerId: new UniqueEntityId(testAnswerId),
          authorId: student.id,
        })
      );
    }

    const page1 = await sut.execute({
      answerId: testAnswerId,
      page: 1,
    });

    expect(page1.value?.comments).toHaveLength(20);

    const page2 = await sut.execute({
      answerId: testAnswerId,
      page: 2,
    });

    expect(page2.value?.comments).toHaveLength(2);
  });
});
