import { ValueObject } from "@/core/entities/value-object";

export interface CommentWithAuthorProps {
  commentId: string;
  content: string;
  author: {
    id: string;
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
