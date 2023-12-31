import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ENV } from 'src/core/constant';
import { JwtPayload } from '../types';

@Injectable()
export class AtStrategy extends PassportStrategy(
  Strategy,
  ENV.JWT_ACCESS_TOKEN,
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ENV.JWT_AT_SECRET,
    });
  }

  validate(payload: JwtPayload) {
    console.log({payload});
    return payload;
  }
}
