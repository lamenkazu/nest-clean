import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteQuestionCommentService } from "@/domain/forum/application/services/delete-question-comment";

@Controller("/questions/comments/:id")
export class DeleteQuestionCommentController {
  constructor(private deleteQuestionComment: DeleteQuestionCommentService) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("id") questionCommentId: string
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestionComment.execute({
      authorId: userId,
      questionCommentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
