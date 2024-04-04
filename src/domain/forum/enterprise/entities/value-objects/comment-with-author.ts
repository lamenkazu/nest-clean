import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";

export interface CommentWithAuthorProps {
  commentId: UniqueEntityId;
  content: string;
  author: {
    id: UniqueEntityId;
    name: string;
  };
  createdAt: Date;
  updatedAt?: Date | null;
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props);
  }

  get commentId() {
    return this.props.commentId;
  }

  get content() {
    return this.props.content;
  }

  get author() {
    return this.props.author;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
