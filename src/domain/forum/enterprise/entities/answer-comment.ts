import { Optional } from "@/core/@types/optional";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Comment, CommentProps } from "./comment";
import { CommentedAnswerEvent } from "../events/commented-answer-event";

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId;
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  static create(
    props: Optional<AnswerCommentProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    const isNewAnswerComment = !id;

    if (isNewAnswerComment) {
      answerComment.addDomainEvent(new CommentedAnswerEvent(answerComment));
    }

    return answerComment;
  }

  get answerId() {
    return this.props.answerId;
  }
}
