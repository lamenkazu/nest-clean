import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationService } from "../services/send-notification";
import { CommentedAnswerEvent } from "@/domain/forum/enterprise/events/commented-answer-event";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnCommentedAnswer implements EventHandler {
  constructor(
    private answerCommentsRepo: AnswerCommentsRepository,
    private sendNotification: SendNotificationService
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this), // bind(this) associa o this dessa classe para onde quer que ela seja chamada. Caso contrário, o this será o DomainEvents, e não o OnAnswerCreated
      CommentedAnswerEvent.name
    );
  }

  private async sendNewAnswerCommentNotification({
    answerComment,
  }: CommentedAnswerEvent) {
    const comment = await this.answerCommentsRepo.findById(
      answerComment.id.toString()
    );

    if (comment) {
      await this.sendNotification.execute({
        recipientId: comment.answerId.toString(),
        title: `Sua resposta à uma pergunta recebeu um novo comentário!`,
        content: `${comment.content.substring(0, 40).concat("...")}`,
      });
    }
  }
}
