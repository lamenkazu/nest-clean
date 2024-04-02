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

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
  ],
  providers: [
    CreateQuestionService,
    KnowRecentQuestionsService,
    RegisterStudentService,
    AuthenticateStudentService,
    KnowQuestionBySlugService,
    EditQuestionService,
  ],
})
export class HttpModule {}
