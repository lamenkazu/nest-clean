import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Fetch Answer Comments (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;

  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let answerCommentFactory: AnswerCommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    answerCommentFactory = moduleRef.get(AnswerCommentFactory);

    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test.only("[GET] /answers/:answerId/comments", async () => {
    const user = await studentFactory.makePrismaStudent({
      name: "Jane Doe",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    });

    await Promise.all([
      answerCommentFactory.makePrismaAnswerComment({
        answerId: answer.id,
        content: "Comment 01",
        authorId: user.id,
      }),
      answerCommentFactory.makePrismaAnswerComment({
        answerId: answer.id,
        content: "Comment 02",
        authorId: user.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/answers/${answer.id.toString()}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          content: "Comment 01",
          author: expect.objectContaining({ name: "Jane Doe" }),
        }),
        expect.objectContaining({
          content: "Comment 02",
          author: expect.objectContaining({ name: "Jane Doe" }),
        }),
      ]),
    });
  });
});
