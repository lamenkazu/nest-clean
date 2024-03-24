import { QuestionsRepository } from "../repositories/questions-repository";
import { Question } from "../../enterprise/entities/question";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";

interface KnowRecentQuestionsServiceRequest {
  page: number;
}

type KnowRecentQuestionsServiceResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

@Injectable()
export class KnowRecentQuestionsService {
  constructor(private questionRepo: QuestionsRepository) {}

  async execute({
    page,
  }: KnowRecentQuestionsServiceRequest): Promise<KnowRecentQuestionsServiceResponse> {
    const questions = await this.questionRepo.findManyRecent({ page });

    return right({
      questions,
    });
  }
}
