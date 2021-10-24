import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { Portfolio, PortfolioSchema } from './schema/portfolio.schema';
import { StocksModule } from '../stocks/stocks.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Portfolio.name, schema: PortfolioSchema },
    ]),
    StocksModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
