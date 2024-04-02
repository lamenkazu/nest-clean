import { Module } from "@nestjs/common";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { DatabaseModule } from "../database/prisma/database.module";
import { CreateQuestionService } from "@/domain/forum/application/services/create-question";
import { KnowRecentQuestionsService } from "@/domain/forum/application/services/know-recent-questions";
import { RegisterStudentService } from "@/domain/account/application/services/register-student";
import { AuthenticateStudentService } from "@/domain/account/application/services/authenticate-student";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { GetQuestionBySlugController } from "./controllers/get-question-by-slug.controller";
import { KnowQuestionBySlugService } from "@/domain/forum/application/services/know-question-by-slug";
import { EditQuestionController } from "./controllers/edit-question.controller";
import { EditQuestionService } from "@/domain/forum/application/services/edit-question";
import { DeleteQuestionController } from "./controllers/delete-question.controller";
import { DeleteQuestionService } from "@/domain/forum/application/services/delete-question";
import { AnswerQuestionController } from "./controllers/answer-question.controller";
import { AnswerQuestionService } from "@/domain/forum/application/services/answer-question";
import { EditAnswerController } from "./controllers/edit-answer.controller";
import { EditAnswerService } from "@/domain/forum/application/services/edit-answer";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
  ],
  providers: [
    CreateQuestionService,
    KnowRecentQuestionsService,
    RegisterStudentService,
    AuthenticateStudentService,
    KnowQuestionBySlugService,
    EditQuestionService,
    DeleteQuestionService,
    AnswerQuestionService,
    EditAnswerService,
  ],
})
export class HttpModule {}
