import { makeQuestionComment } from "test/factories/make-question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { FetchQuestionCommentsService } from "./fetch-question-comments";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentRepo: InMemoryStudentRepository;
let inMemoryQuestionCommentsRepo: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsService;

describe("Fetch Question Comments", () => {
  beforeEach(() => {
    inMemoryStudentRepo = new InMemoryStudentRepository();
    inMemoryQuestionCommentsRepo = new InMemoryQuestionCommentsRepository(
      inMemoryStudentRepo
    );
    sut = new FetchQuestionCommentsService(inMemoryQuestionCommentsRepo);
  });

  it("should be able to fetch question comments", async () => {
    const student = makeStudent({ name: "Jane Doe" });

    inMemoryStudentRepo.items.push(student);

    const testQuestionId = "question-id-1";

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityId(testQuestionId),
      authorId: student.id,
    });

    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityId(testQuestionId),
      authorId: student.id,
    });

    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityId(testQuestionId),
      authorId: student.id,
    });

    await inMemoryQuestionCommentsRepo.create(comment1);

    await inMemoryQuestionCommentsRepo.create(comment2);

    await inMemoryQuestionCommentsRepo.create(comment3);

    const result = await sut.execute({
      questionId: testQuestionId,
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

  it("should be able to fetch paginted question questionComments", async () => {
    const student = makeStudent({ name: "Jane Doe" });

    inMemoryStudentRepo.items.push(student);

    const testQuestionId = "question-id-1";

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepo.create(
        makeQuestionComment({
          questionId: new UniqueEntityId(testQuestionId),
          authorId: student.id,
        })
      );
    }

    const page1 = await sut.execute({
      questionId: testQuestionId,
      page: 1,
    });

    expect(page1.value?.comments).toHaveLength(20);

    const page2 = await sut.execute({
      questionId: testQuestionId,
      page: 2,
    });

    expect(page2.value?.comments).toHaveLength(2);
  });
});
