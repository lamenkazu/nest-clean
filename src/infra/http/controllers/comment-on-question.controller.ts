import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { AnswerQuestionService } from "@/domain/forum/application/services/answer-question";
import { CommentOnQuestionService } from "@/domain/forum/application/services/comment-on-question";

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
});

type AnswerQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>;

@Controller("/questions/:questionId/comments")
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(commentOnQuestionBodySchema)) //É possível usar o pipe dentro do body
    body: AnswerQuestionBodySchema,
    @Param("questionId") questionId: string
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnQuestion.execute({
      authorId: userId,
      content,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
