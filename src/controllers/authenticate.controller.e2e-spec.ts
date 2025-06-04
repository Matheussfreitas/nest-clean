import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import request from 'supertest';

describe('Authenticate (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash('password123', 8), // Corrigido: salva senha já criptografada
      },
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: 'password123', // Corrigido: envia senha em texto puro
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
