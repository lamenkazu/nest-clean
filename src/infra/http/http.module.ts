import { Module } from "@nestjs/common";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { DatabaseModule } from "../database/prisma/database.module";
import { CreateQuestionService } from "@/domain/forum/application/services/create-question";
import { KnowRecentQuestionsService } from "@/domain/forum/application/services/know-recent-questions";

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [CreateQuestionService, KnowRecentQuestionsService],
})
export class HttpModule {}
