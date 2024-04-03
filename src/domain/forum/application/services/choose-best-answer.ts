import { AnswerRepository } from "../repositories/answers-repository";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";

interface ChooseBestAnswerServiceRequest {
  authorId: string;
  answerId: string;
}

type ChooseBestAnswerServiceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

@Injectable()
export class ChooseBestAnswerService {
  constructor(
    private questionRepo: QuestionsRepository,
    private answerRepo: AnswerRepository
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseBestAnswerServiceRequest): Promise<ChooseBestAnswerServiceResponse> {
    const answer = await this.answerRepo.findById(answerId);
    if (!answer) return left(new ResourceNotFoundError());

    const question = await this.questionRepo.findById(
      answer.questionId.toString()
    );
    if (!question) return left(new ResourceNotFoundError());

    if (authorId !== question.authorId.toString())
      return left(new NotAllowedError());

    question.bestAnswerId = answer.id;

    await this.questionRepo.update(question);

    return right({
      question,
    });
  }
}
