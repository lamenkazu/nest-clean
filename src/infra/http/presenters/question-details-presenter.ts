import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { AttachmentPresenter } from "./attachment-presenter";

export class QuestionDetailsPresenter {
  static toHTTP(question: QuestionDetails) {
    return {
      questionId: question.questionId.toString(),
      title: question.title,
      slug: question.slug.value,
      content: question.content,
      author: {
        id: question.author.id,
        name: question.author.name,
      },
      bestAnswerId: question.bestAnswerId?.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      attachments: question.attachments.map(AttachmentPresenter.toHTTP),
    };
  }
}
