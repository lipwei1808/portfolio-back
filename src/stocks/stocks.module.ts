import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { Stock, StockSchema } from './schemas/stock.schema';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
  ],
  providers: [StocksService],
  controllers: [StocksController],
  exports: [StocksService],
})
export class StocksModule {}
