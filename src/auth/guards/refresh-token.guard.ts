import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { refresh_token: refreshToken } = request.cookies;

    try {
      const { id } = await this.jwtService.verify(refreshToken);
      request.userId = id;
      return true;
    } catch {
      return false;
    }
  }
}
