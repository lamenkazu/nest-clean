import { QuestionsRepository } from "../repositories/questions-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { QuestionDetails } from "../../enterprise/entities/value-objects/question-details";

interface KnowQuestionBySlugServiceRequest {
  slug: string;
}

type KnowQuestionBySlugServiceResponse = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails;
  }
>;

@Injectable()
export class KnowQuestionBySlugService {
  constructor(private questionRepo: QuestionsRepository) {}

  async execute({
    slug,
  }: KnowQuestionBySlugServiceRequest): Promise<KnowQuestionBySlugServiceResponse> {
    const question = await this.questionRepo.findDetailsBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({
      question,
    });
  }
}
