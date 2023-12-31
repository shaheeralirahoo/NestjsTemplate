import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { ROLE } from '../enum/user.enum';
import CheckPublic from './checkPublic';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (CheckPublic(this.reflector, context)) return true;

    const roles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    console.log({ role_guard: request.user?.role });
    return roles?.some((a) => a == request.user?.role); // This User is being set by AT Strategy
  }
}
