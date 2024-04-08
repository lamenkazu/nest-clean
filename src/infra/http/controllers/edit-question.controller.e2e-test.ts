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

describe("Edit Question (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;

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

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);

    attachFactory = moduleRef.get(AttachmentFactory);
    questionAttachFactory = moduleRef.get(QuestionAttachmentFactory);

    await app.init();
  });

  test("[PUT] /questions/:id", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    //Cria dois attachments
    const attach1 = await attachFactory.makePrismaAttachment();
    const attach2 = await attachFactory.makePrismaAttachment();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    //relaciona os attachments com a question
    await questionAttachFactory.makePrismaAttachment({
      attachmentId: attach1.id,
      questionId: question.id,
    });

    await questionAttachFactory.makePrismaAttachment({
      attachmentId: attach2.id,
      questionId: question.id,
    });

    //Testa edição do Attachment
    const attach3 = await attachFactory.makePrismaAttachment();

    const response = await request(app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "New title",
        content: "New content",
        attachments: [attach1.id.toString(), attach3.id.toString()],
      });

    expect(response.statusCode).toBe(204);

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: "New title",
        content: "New content",
      },
    });

    expect(questionOnDatabase).toBeTruthy();

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id,
      },
    });

    console.log(attachmentsOnDatabase);

    expect(attachmentsOnDatabase).toHaveLength(2);
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attach1.id.toString(),
        }),
        expect.objectContaining({
          id: attach3.id.toString(),
        }),
      ])
    );
  });
});
