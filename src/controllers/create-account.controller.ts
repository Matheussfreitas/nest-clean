import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { CreateAccountService } from 'src/services/create-account.service';
import { z } from 'zod';

const CreateAccountSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountDTO = z.infer<typeof CreateAccountSchema>;

@Controller('/accounts')
export class CreateAccountController {
  constructor(private createAccountService: CreateAccountService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(CreateAccountSchema))
  async handle(@Body() body: CreateAccountDTO) {
    return this.createAccountService.createAccount(body);
  }
}
