import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET отсутствует в переменных окружения');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret, // Теперь TypeScript знает, что это не undefined
    });
  }

  validate(payload: {id: string, email: string}): {id: string, email: string} {
    // Вы можете добавить логику верификации здесь, если нужно
    return {
      id: payload.id,
      email: payload.email,
    };
  }
}
