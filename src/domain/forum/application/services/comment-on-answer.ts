import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerRepository } from "../repositories/answers-repository";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface CommentOnAnswerServiceRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerServiceResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment;
  }
>;

export class CommentOnAnswerService {
  constructor(
    private answerRepo: AnswerRepository,
    private answerCommentRepo: AnswerCommentsRepository
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerServiceRequest): Promise<CommentOnAnswerServiceResponse> {
    const answer = await this.answerRepo.findById(answerId);

    if (!answer) return left(new ResourceNotFoundError());

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    });

    await this.answerCommentRepo.create(answerComment);

    return right({
      answerComment,
    });
  }
}
