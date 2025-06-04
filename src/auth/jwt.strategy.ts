import { Injectable, UsePipes } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Env } from '@//env';
import { ZodValidationPipe } from '@//pipes/zod-validation-pipe';
import z from 'zod';

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const jwtSecret = config.get('JWT_PUBLIC_KEY', { infer: true });
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(jwtSecret, 'base64'),
      algorithms: ['RS256'],
    });
  }

  @UsePipes(new ZodValidationPipe(tokenPayloadSchema))
  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parseAsync(payload);
  }
}
