import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import { SendNotificationService } from "../services/send-notification";
import { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepo: AnswerRepository,
    private sendNotification: SendNotificationService
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this), // bind(this) associa o this dessa classe para onde quer que ela seja chamada. Caso contrário, o this será o DomainEvents, e não o OnAnswerCreated
      QuestionBestAnswerChosenEvent.name
    );
  }

  private async sendQuestionBestAnswerNotification({
    bestAnswerId,
    question,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepo.findById(bestAnswerId.toString());

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer?.authorId.toString(),
        title: `Sua resposta foi escolhida!`,
        content: `A resposta que você enviou em ${question.title.substring(
          0,
          20
        )} foi escolhida pelo autor`,
      });
    }
  }
}
