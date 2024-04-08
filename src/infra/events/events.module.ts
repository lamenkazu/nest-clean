import { SendNotificationService } from "@/domain/notification/application/services/send-notification";
import { OnAnswerCreated } from "@/domain/notification/application/subscribers/on-answer-created";
import { OnCommentedAnswer } from "@/domain/notification/application/subscribers/on-commented-answer";
import { OnQuestionBestAnswerChosen } from "@/domain/notification/application/subscribers/on-question-best-answer-chosen";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/prisma/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [
    OnAnswerCreated,
    OnCommentedAnswer,
    OnAnswerCreated,
    OnQuestionBestAnswerChosen,

    SendNotificationService,
  ],
})
export class EventsModule {}
