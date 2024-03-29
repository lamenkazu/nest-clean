import { Optional } from "@/core/@types/optional";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Comment, CommentProps } from "./comment";
import { CommentedQuestionEvent } from "../events/commented-question-event";

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId;
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  static create(
    props: Optional<QuestionCommentProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    const isNewQuestionComment = !id;

    if (isNewQuestionComment) {
      questionComment.addDomainEvent(
        new CommentedQuestionEvent(questionComment)
      );
    }

    return questionComment;
  }

  get questionId() {
    return this.props.questionId;
  }
}
