import { Either, right } from "@/core/either";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

interface FetchQuestionCommentsServiceRequest {
  questionId: string;
  page: number;
}

type FetchQuestionCommentsServiceResponse = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

@Injectable()
export class FetchQuestionCommentsService {
  constructor(private questionCommentsRepo: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsServiceRequest): Promise<FetchQuestionCommentsServiceResponse> {
    const comments =
      await this.questionCommentsRepo.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        }
      );

    return right({
      comments,
    });
  }
}
