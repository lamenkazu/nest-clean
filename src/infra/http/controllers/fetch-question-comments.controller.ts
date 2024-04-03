import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchQuestionCommentsService } from "@/domain/forum/application/services/fetch-question-comments";
import { CommentPresenter } from "../presenters/comment-presenter";

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller("/questions/:questionId/comments")
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsService) {}

  @Get()
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Param("questionId") questionId: string
  ) {
    const result = await this.fetchQuestionComments.execute({
      page,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const questionComments = result.value.questionComments;

    return {
      comments: questionComments.map(CommentPresenter.toHTTP),
    };
  }
}
