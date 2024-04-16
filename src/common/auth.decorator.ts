import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { LocalStrategy } from 'src/auth/local.strategy';

export const Auth = (role: RoleEnum) => {
  return applyDecorators(
    SetMetadata('role', role),
    UseGuards(AuthGuard, LocalAuthGuard),
    LocalStrategy(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
