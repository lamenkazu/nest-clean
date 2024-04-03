import { Either, right } from "@/core/either";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { Injectable } from "@nestjs/common";

interface FetchAnswerCommentsServiceRequest {
  answerId: string;
  page: number;
}

type FetchAnswerCommentsServiceResponse = Either<
  null,
  {
    answerComments: AnswerComment[];
  }
>;

@Injectable()
export class FetchAnswerCommentsService {
  constructor(private answerCommentsRepo: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsServiceRequest): Promise<FetchAnswerCommentsServiceResponse> {
    const answerComments = await this.answerCommentsRepo.findManyByAnswerId(
      answerId,
      {
        page,
      }
    );

    return right({
      answerComments,
    });
  }
}
