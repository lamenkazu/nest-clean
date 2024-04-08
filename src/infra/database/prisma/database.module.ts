import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaQuestionRepository } from "./repositories/prisma-questions-repository";
import { PrismaAnswersRepository } from "./repositories/prisma-answers-repository";
import { PrismaQuestionCommentsRepository } from "./repositories/prisma-question-comments-repository";
import { PrismaAnswerCommentsRepository } from "./repositories/prisma-answer-comments-repository";
import { PrismaQuestionAttachmentsRepository } from "./repositories/prisma-question-attachments-repository";
import { PrismaAnswerAttachmentsRepository } from "./repositories/prisma-answer-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { StudentsRepository } from "@/domain/account/application/repositories/students-repository";
import { PrismaStudentsRepository } from "./repositories/prisma-students-repository";
import { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { PrismaAttachmentsRepository } from "./repositories/prisma-attachments-repository";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { PrismaNotificationsRepository } from "./repositories/prisma-notifications-repository";
import { CacheModule } from "@/infra/cache/cache.module";

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionRepository,
    },
    {
      provide: AnswerRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    StudentsRepository,
    QuestionsRepository,
    AnswerRepository,
    QuestionCommentsRepository,
    AnswerCommentsRepository,
    QuestionAttachmentsRepository,
    AnswerAttachmentsRepository,
    AttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
