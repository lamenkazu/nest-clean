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
import { EditAnswerService } from "@/domain/forum/application/services/edit-answer";

const editAnswerBodySchema = z.object({
  content: z.string(),
});

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

@Controller("/answers/:id")
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerService) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(editAnswerBodySchema)) //É possível usar o pipe dentro do body
    body: EditAnswerBodySchema,
    @Param("id") answerId: string
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.editAnswer.execute({
      content,
      authorId: userId,
      attachmentsIds: [],
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
