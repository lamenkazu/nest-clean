import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { StudentFactory } from "test/factories/make-student";

describe("Get question by slug (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let questionFactory: QuestionFactory;
  let studentFactory: StudentFactory;
  let attachFactory: AttachmentFactory;
  let questionAttachFactory: QuestionAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    questionFactory = moduleRef.get(QuestionFactory);
    studentFactory = moduleRef.get(StudentFactory);
    attachFactory = moduleRef.get(AttachmentFactory);
    questionAttachFactory = moduleRef.get(QuestionAttachmentFactory);

    await app.init();
  });

  test("[GET] /questions/:slug", async () => {
    const user = await studentFactory.makePrismaStudent({
      name: "Jane Doe",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: "question 01",
      content: "content",
    });

    const attachment = await attachFactory.makePrismaAttachment({
      title: "Some attachment",
    });

    await questionAttachFactory.makePrismaAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const response = await request(app.getHttpServer())
      .get("/questions/question-01")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: "question 01",
        author: expect.objectContaining({ name: "Jane Doe" }),
        attachments: [
          expect.objectContaining({
            title: "Some attachment",
          }),
        ],
      }),
    });
  });
});
