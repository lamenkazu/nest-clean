import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchAnswerCommentsService } from "@/domain/forum/application/services/fetch-answer-comments";
import { CommentPresenter } from "../presenters/comment-presenter";

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller("/answers/:answerId/comments")
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsService) {}

  @Get()
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Param("answerId") answerId: string
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const answerComments = result.value.answerComments;

    return {
      comments: answerComments.map(CommentPresenter.toHTTP),
    };
  }
}
