import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import { SendNotificationService } from "../services/send-notification";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepo: QuestionsRepository,
    private sendNotification: SendNotificationService
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this), // bind(this) associa o this dessa classe para onde quer que ela seja chamada. Caso contrário, o this será o DomainEvents, e não o OnAnswerCreated
      AnswerCreatedEvent.name
    );
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepo.findById(
      answer.questionId.toString()
    );

    if (question) {
      await this.sendNotification.execute({
        recipientId: question?.authorId.toString(),
        title: `Nova resposta em ${question.title
          .substring(0, 40)
          .concat("...")}`,
        content: answer.excerpt,
      });
    }
  }
}
