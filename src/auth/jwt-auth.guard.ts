import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_COMPUTER, IS_PUBLIC_KEY } from './jwt.strategy';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ComputerService } from '../computer/computer.service';
import { UUID } from 'crypto';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly computerService: ComputerService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isComputer = this.reflector.getAllAndOverride<boolean>(IS_COMPUTER, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      if (isComputer) {
        const payload = this.jwtService.decode(token);
        req['user'] = payload;
        return this.isComputerActive(payload.computerId);
      }
    } catch {
      throw new UnauthorizedException();
    }

    return super.canActivate(context);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async isComputerActive(computerId: UUID) {
    const computerActive = (await this.computerService.findByComputerId(computerId)).isActive;
    return !!computerActive;
  }
}
