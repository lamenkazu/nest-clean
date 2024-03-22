import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAnswersRepository implements AnswerRepository {
  findById(id: string): Promise<Answer | null> {
    throw new Error("Method not implemented.");
  }
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]> {
    throw new Error("Method not implemented.");
  }
  create(answer: Answer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(answer: Answer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  update(answer: Answer): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
