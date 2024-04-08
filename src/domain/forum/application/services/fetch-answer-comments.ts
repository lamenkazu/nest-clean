import { Either, right } from "@/core/either";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

interface FetchAnswerCommentsServiceRequest {
  answerId: string;
  page: number;
}

type FetchAnswerCommentsServiceResponse = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

@Injectable()
export class FetchAnswerCommentsService {
  constructor(private answerCommentsRepo: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsServiceRequest): Promise<FetchAnswerCommentsServiceResponse> {
    const comments = await this.answerCommentsRepo.findManyByAnswerIdWithAuthor(
      answerId,
      {
        page,
      }
    );

    return right({
      comments,
    });
  }
}
