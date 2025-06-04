import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from '@//pipes/zod-validation-pipe';
import { PrismaService } from '@//prisma/prisma.service';
import z from 'zod';

const pagequeryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pagequeryParamsSchema);

type PageQueryParams = z.infer<typeof pagequeryParamsSchema>;

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParams) {
    const perPage = 10;

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { questions };
  }
}
