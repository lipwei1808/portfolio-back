import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddPortfolioDto } from './dto/add-portfolio.dto';
import { PortfolioService } from './portfolio.service';
import { UserId } from '../auth/decorators/user-id.decorator';

@UseGuards(JwtAuthGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Post()
  async addPortfolio(@Body() body: AddPortfolioDto, @UserId() id: string) {
    const portfolio = await this.portfolioService.addPortfolio(body, id);
    if (!portfolio) {
      throw new HttpException('Max portfolio reached!', HttpStatus.BAD_REQUEST);
    }
    return portfolio;
  }

  @Get()
  getPortfolios(@UserId() id: string) {
    console.log('pass');
    return this.portfolioService.getPortfolio(id);
  }

  @Delete()
  async deletePortfolio(
    @Body('portfolioId') portfolioId: string,
    @UserId() id: string,
  ) {
    const portfolio = await this.portfolioService.deletePortfolio(
      portfolioId,
      id,
    );
    console.log(portfolio);
    if (!portfolio) {
      throw new HttpException(
        'Error deleting portfolio!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return portfolio;
  }
}
