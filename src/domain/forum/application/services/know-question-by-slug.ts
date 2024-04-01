import { QuestionsRepository } from "../repositories/questions-repository";
import { Question } from "../../enterprise/entities/question";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface KnowQuestionBySlugServiceRequest {
  slug: string;
}

type KnowQuestionBySlugServiceResponse = Either<
  ResourceNotFoundError,
  {
    question: Question;
  }
>;

@Injectable()
export class KnowQuestionBySlugService {
  constructor(private questionRepo: QuestionsRepository) {}

  async execute({
    slug,
  }: KnowQuestionBySlugServiceRequest): Promise<KnowQuestionBySlugServiceResponse> {
    const question = await this.questionRepo.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({
      question,
    });
  }
}
