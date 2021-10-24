import { Controller, UseGuards, Get } from '@nestjs/common';
import { UserId } from 'src/auth/decorators/user-id.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@UserId() id: string) {
    return this.userService.findUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  getBalance(@UserId() id: string) {
    return this.userService.getBalance(id);
  }
}
