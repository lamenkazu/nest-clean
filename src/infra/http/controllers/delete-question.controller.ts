import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Put,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { EditQuestionService } from "@/domain/forum/application/services/edit-question";
import { DeleteQuestionService } from "@/domain/forum/application/services/delete-question";

@Controller("/questions/:id")
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionService) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("id") questionId: string
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestion.execute({
      authorId: userId,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
