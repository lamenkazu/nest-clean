import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { QuestionPresenter } from "../presenters/question-presenter";
import { KnowQuestionBySlugService } from "@/domain/forum/application/services/know-question-by-slug";

@Controller("/questions/:slug")
export class GetQuestionBySlugController {
  constructor(private knowRecentQuestions: KnowQuestionBySlugService) {}

  @Get()
  async handle(@Param("slug") slug: string) {
    const result = await this.knowRecentQuestions.execute({
      slug,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      question: QuestionPresenter.toHTTP(result.value.question),
    };
  }
}
