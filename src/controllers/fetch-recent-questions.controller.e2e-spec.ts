import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Fetch Recent Questions (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      },
    });

    const accessToken = await jwt.signAsync({ sub: user.id });

    await prisma.question.createMany({
      data: [
        {
          title: 'What is NestJS?',
          slug: 'what-is-nestjs',
          content: 'question 1 content',
          authorId: user.id,
        },
        {
          title: 'What is NestJS? 2',
          slug: 'what-is-nestjs-2',
          content: 'question 2 content',
          authorId: user.id,
        },
        {
          title: 'What is NestJS? 3',
          slug: 'what-is-nestjs-3',
          content: 'question 3 content',
          authorId: user.id,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ slug: 'what-is-nestjs' }),
        expect.objectContaining({ slug: 'what-is-nestjs-2' }),
      ],
    });
  });
});
