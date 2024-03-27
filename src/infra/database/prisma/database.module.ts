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

@Module({
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
    PrismaAnswersRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    StudentsRepository,
    QuestionsRepository,
    PrismaAnswersRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerAttachmentsRepository,
  ],
})
export class DatabaseModule {}
