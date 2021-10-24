import { Body, Controller, Post, Get, Delete, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserId } from '../auth/decorators/user-id.decorator';
import { CreateStockDto } from './dto/create-stock.dto';
import { StocksService } from './stocks.service';

@UseGuards(JwtAuthGuard)
@Controller('stocks')
export class StocksController {
  constructor(private stocksService: StocksService) {}

  @Post()
  addStock(@Body() body: CreateStockDto, @UserId() id: string) {
    return this.stocksService.addStock(body, id);
  }

  @Get()
  getStocks(@UserId() id: string) {
    return this.stocksService.getStocks(id);
  }

  @Post('/portfolio')
  getConsolidatedStocks(
    @Body('portfolio') portfolio: string,
    @UserId() id: string,
  ) {
    return this.stocksService.getConsolidatedStocks(id, portfolio);
  }

  @Get('/distribution')
  getDistribution(@UserId() id: string) {
    return this.stocksService.getDistribution(id);
  }

  @Delete()
  deleteStock(@UserId() userId: string, @Body('stockId') stockId: string) {
    return this.stocksService.deleteStock(userId, stockId);
  }
}
