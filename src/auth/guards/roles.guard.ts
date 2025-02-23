import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    console.log(
      '🚀 ~ RolesGuard ~ canActivate ~ requiredRoles:',
      requiredRoles,
    );

    //else
    const request = context.switchToHttp().getRequest();
    console.log('🚀 ~ RolesGuard ~ canActivate ~ request:', request.user.role);
    let response =
      request.user?.role && requiredRoles.includes(request.user?.role)
        ? true
        : false;

    return response;
  }
}
