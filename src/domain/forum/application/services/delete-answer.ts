import { Either, left, right } from "@/core/either";
import { AnswerRepository } from "../repositories/answers-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";

interface DeleteAnswerServiceRequest {
  authorId: string;
  answerId: string;
}

type DeleteAnswerServiceResponse = Either<ResourceNotFoundError, {}>;

@Injectable()
export class DeleteAnswerService {
  constructor(private answerRepo: AnswerRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerServiceRequest): Promise<DeleteAnswerServiceResponse> {
    const answer = await this.answerRepo.findById(answerId);

    if (!answer) return left(new ResourceNotFoundError());

    if (authorId !== answer.authorId.toString())
      return left(new NotAllowedError());

    await this.answerRepo.delete(answer);

    return right({});
  }
}
