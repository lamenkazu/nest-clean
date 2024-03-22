import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { z } from "zod";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createQuestionBodySchema)) //É possível usar o pipe dentro do body
    body: CreateQuestionBodySchema
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const slug = this.slugify(title);

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    });
  }

  private slugify(title: string): string {
    return title
      .normalize("NFD") // Normaliza a string removendo diacríticos
      .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos
      .toLowerCase() // Converte para minúsculas
      .replace(/[^\w\s-]/g, "") // Remove caracteres não alfanuméricos exceto espaços e hífens
      .replace(/\s+/g, "-") // Substitui espaços por hífens
      .replace(/--+/g, "-") // Remove múltiplos hífens por apenas um
      .replace(/^-+/, "") // Remove hífens do início da string
      .replace(/-+$/, ""); // Remove hífens do final da string
  }
}
