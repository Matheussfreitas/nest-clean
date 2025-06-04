import { Injectable } from '@nestjs/common';
import { PrismaService } from '@//prisma/prisma.service';
import { hash } from 'bcrypt';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class CreateAccountService {
  constructor(private prisma: PrismaService) {}

  async createAccount(body) {
    const { name, email, password } = body;

    const existingAccount = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingAccount) {
      throw new ConflictException('Account with this email already exists');
    }

    const hashedPassword = await hash(password, 8);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}
