import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, SetMetadata } from '@nestjs/common';
import config from './getter.config';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config().secretJwt,
    });
  }

  async validate(payload: any) {
    return { name: payload.name, id: payload.id, cpf: payload.cpf, email: payload.email };
  }
}
