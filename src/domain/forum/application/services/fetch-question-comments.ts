import { Either, right } from "@/core/either";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { Injectable } from "@nestjs/common";

interface FetchQuestionCommentsServiceRequest {
  questionId: string;
  page: number;
}

type FetchQuestionCommentsServiceResponse = Either<
  null,
  {
    questionComments: QuestionComment[];
  }
>;

@Injectable()
export class FetchQuestionCommentsService {
  constructor(private questionCommentsRepo: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsServiceRequest): Promise<FetchQuestionCommentsServiceResponse> {
    const questionComments =
      await this.questionCommentsRepo.findManyByQuestionId(questionId, {
        page,
      });

    return right({
      questionComments,
    });
  }
}
