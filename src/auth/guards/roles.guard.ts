import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IUser } from '../../users/interfaces/user.interface';
import { RoleType } from '../../common/mock';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const user: IUser = request?.user;

    if (!user) return false;

    let hasPermission = user.isSuperAdmin;

    if (!roles) return hasPermission;

    for (let index = 0; index < roles.length; index++) {
      const role = roles[index];
      switch (role) {
        case RoleType.ADMIN:
          hasPermission = user.isAdmin || hasPermission;
          break;
        default:
          break;
      }
      if (hasPermission) return true;
    }
    return hasPermission;
  }
}
