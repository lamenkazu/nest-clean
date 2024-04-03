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
import { CommentOnAnswerService } from "@/domain/forum/application/services/comment-on-answer";

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
});

type AnswerQuestionBodySchema = z.infer<typeof commentOnAnswerBodySchema>;

@Controller("/answers/:answerId/comments")
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(commentOnAnswerBodySchema)) //É possível usar o pipe dentro do body
    body: AnswerQuestionBodySchema,
    @Param("answerId") answerId: string
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnAnswer.execute({
      authorId: userId,
      content,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
