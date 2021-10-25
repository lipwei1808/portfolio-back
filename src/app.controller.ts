import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './auth/dto/create-user.dto';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { SerializeInterceptor } from './auth/interceptors/serialize.interceptor';
import { UserDocument } from 'src/user/schemas/user.schema';
import { RefreshTokenGuard } from './auth/guards/refresh-token.guard';
import { UpdatedUserDto } from './auth/dto/updated-user.dto';
import { UserId } from './auth/decorators/user-id.decorator';
import { UserService } from './user/user.service';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

@Controller('')
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseInterceptors(SerializeInterceptor)
  @Post('/signup')
  async signup(@Body() body: CreateUserDto): Promise<UserDocument> {
    try {
      return await this.authService.signup(body);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { access_token, refresh_token } = this.authService.login(req.user);
    res.cookie('refresh_token', refresh_token, {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      maxAge: 6000000,
    });
    return { access_token };
  }

  // verify for requests to backend
  @UseInterceptors(SerializeInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('verify')
  verify(@Req() req: Request) {
    return req.user;
  }

  // refresh user token on client page reload
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  refreshToken(
    @Req() req: Request,
  ): Promise<{ access_token: string; user: UserDocument }> {
    return this.authService.refreshToken(req.userId);
  }

  @UseInterceptors(SerializeInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('edit-profile')
  editProfile(@UserId() id: string, @Body() body: UpdatedUserDto) {
    return this.authService.updateUser(id, body);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('refresh_token', '', {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('edit-balance')
  editBalance(@Body() body, @UserId() id: string) {
    return this.userService.editBalance(body.balance, id);
  }
}
