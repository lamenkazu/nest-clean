import { AnswerRepository } from "../repositories/answers-repository";
import { Answer } from "../../enterprise/entities/answer";
import { Either, right } from "@/core/either";

interface FetchQuestionAnswersServiceRequest {
  questionId: string;
  page: number;
}

type FetchQuestionAnswersServiceResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

export class FetchQuestionAnswersService {
  constructor(private answerRepo: AnswerRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersServiceRequest): Promise<FetchQuestionAnswersServiceResponse> {
    const answers = await this.answerRepo.findManyByQuestionId(questionId, {
      page,
    });

    return right({
      answers,
    });
  }
}
