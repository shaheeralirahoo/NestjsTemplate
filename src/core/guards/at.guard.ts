import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ENV } from '../constant';
import CheckPublic from './checkPublic';

@Injectable() // Access Token Guard
export class AtGuard extends AuthGuard(ENV.JWT_ACCESS_TOKEN) {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    console.log({ public_guard: CheckPublic(this.reflector, context) });
    if (CheckPublic(this.reflector, context)) return true;
    return super.canActivate(context);
  }
}
