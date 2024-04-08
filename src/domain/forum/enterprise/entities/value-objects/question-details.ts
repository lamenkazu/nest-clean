import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";
import { Slug } from "./slug";
import { Attachment } from "../attachment";

export interface QuestionDetailsProps {
  questionId: UniqueEntityId;
  author: {
    id: UniqueEntityId;
    name: string;
  };
  title: string;
  slug: Slug;
  content: string;
  attachments: Attachment[];
  bestAnswerId?: UniqueEntityId | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props);
  }

  get questionId() {
    return this.props.questionId;
  }

  get author() {
    return this.props.author;
  }

  get title() {
    return this.props.title;
  }

  get slug() {
    return this.props.slug;
  }

  get content() {
    return this.props.content;
  }

  get attachments() {
    return this.props.attachments;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
