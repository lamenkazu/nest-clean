import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ChooseBestAnswerService } from "@/domain/forum/application/services/choose-best-answer";

@Controller("/answers/:answerId/choose-as-best")
export class ChooseBestAnswerController {
  constructor(private chooseBestAnswer: ChooseBestAnswerService) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("answerId") answerId: string
  ) {
    const userId = user.sub;

    const result = await this.chooseBestAnswer.execute({
      authorId: userId,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
