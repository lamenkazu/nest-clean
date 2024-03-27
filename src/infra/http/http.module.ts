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

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    CreateQuestionService,
    KnowRecentQuestionsService,
    RegisterStudentService,
    AuthenticateStudentService,
  ],
})
export class HttpModule {}
