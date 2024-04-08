import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationService } from "../services/send-notification";
import { CommentedQuestionEvent } from "@/domain/forum/enterprise/events/commented-question-event";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnCommentedQuestion implements EventHandler {
  constructor(
    private questionCommentsRepo: QuestionCommentsRepository,
    private sendNotification: SendNotificationService
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionCommentNotification.bind(this), // bind(this) associa o this dessa classe para onde quer que ela seja chamada. Caso contrário, o this será o DomainEvents, e não o OnAnswerCreated
      CommentedQuestionEvent.name
    );
  }

  private async sendNewQuestionCommentNotification({
    questionComment,
  }: CommentedQuestionEvent) {
    const comment = await this.questionCommentsRepo.findById(
      questionComment.id.toString()
    );

    if (comment) {
      await this.sendNotification.execute({
        recipientId: comment.questionId.toString(),
        title: `Sua pergunta recebeu um novo comentário`,
        content: `${comment.content.substring(0, 40).concat("...")}`,
      });
    }
  }
}
