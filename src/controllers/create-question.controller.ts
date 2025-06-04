import { CurrentUser } from '@//auth/current-user.decorator';
import { UserPayload } from '@//auth/jwt.strategy';
import { ZodValidationPipe } from '@//pipes/zod-validation-pipe';
import { PrismaService } from '@//prisma/prisma.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type createQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createQuestionBodySchema))
  async handle(
    @Body() body: createQuestionBody,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body;
    const userId = user.sub;
    const slug = this.convertSlug(title);

    await this.prisma.question.create({
      data: {
        title,
        slug,
        content,
        authorId: userId,
      },
    });
  }

  private convertSlug(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }
}
