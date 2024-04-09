import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { AppModule } from "@/infra/app.module";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { CacheModule } from "@/infra/cache/cache.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { StudentFactory } from "test/factories/make-student";

describe("Prisma Questions Repository (E2E)", () => {
  let app: INestApplication;

  let questionFactory: QuestionFactory;
  let studentFactory: StudentFactory;
  let attachFactory: AttachmentFactory;
  let questionAttachFactory: QuestionAttachmentFactory;

  let questionsRepo: QuestionsRepository;
  let cacheRepo: CacheRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    questionFactory = moduleRef.get(QuestionFactory);
    studentFactory = moduleRef.get(StudentFactory);
    attachFactory = moduleRef.get(AttachmentFactory);
    questionAttachFactory = moduleRef.get(QuestionAttachmentFactory);

    questionsRepo = moduleRef.get(QuestionsRepository);
    cacheRepo = moduleRef.get(CacheRepository);

    await app.init();
  });

  it("should cache question details", async () => {
    const user = await studentFactory.makePrismaStudent({});

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachFactory.makePrismaAttachment({});

    await questionAttachFactory.makePrismaAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    const questionDetails = await questionsRepo.findDetailsBySlug(slug);

    const cached = await cacheRepo.get(`question:${slug}:details`);

    expect(cached).toEqual(JSON.stringify(questionDetails));
  });

  it("should return cached question details on subsequent calls", async () => {
    const user = await studentFactory.makePrismaStudent({});

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachFactory.makePrismaAttachment({});

    await questionAttachFactory.makePrismaAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    await cacheRepo.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true })
    );

    const questionDetails = await questionsRepo.findDetailsBySlug(slug);

    expect(questionDetails).toEqual({ empty: true });
  });

  it("should reset question details cache when saving the question", async () => {
    const user = await studentFactory.makePrismaStudent({});

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachFactory.makePrismaAttachment({});

    await questionAttachFactory.makePrismaAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    await cacheRepo.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true })
    );

    await questionsRepo.update(question);

    const cached = await cacheRepo.get(`question:${slug}:details`);

    expect(cached).toBeNull();
  });
});
