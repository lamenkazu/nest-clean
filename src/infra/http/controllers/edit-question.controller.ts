import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { EditQuestionService } from "@/domain/forum/application/services/edit-question";

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@Controller("/questions/:id")
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionService) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(editQuestionBodySchema)) //É possível usar o pipe dentro do body
    body: EditQuestionBodySchema,
    @Param("id") questionId: string
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
