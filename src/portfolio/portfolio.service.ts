import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AddPortfolioDto } from './dto/add-portfolio.dto';
import { StocksService } from '../stocks/stocks.service';
import { Portfolio, PortfolioDocument } from './schema/portfolio.schema';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name)
    private portfolioModel: Model<PortfolioDocument>,
    private stocksService: StocksService,
  ) {}

  async addPortfolio(addPortfolioDto: AddPortfolioDto, id: string) {
    const portfolios = await this.getPortfolio(id);
    if (portfolios.length >= 3) return null;

    const objectId = new Types.ObjectId(id);
    const portfolio = new this.portfolioModel({
      ...addPortfolioDto,
      userId: objectId,
    });
    return portfolio.save();
  }

  getPortfolio(id: string) {
    const objectId = new Types.ObjectId(id);
    return this.portfolioModel
      .find({ userId: objectId })
      .populate({ path: 'userId', select: 'email' })
      .exec();
  }

  async deletePortfolio(portfolioId: string, id: string) {
    try {
      await this.stocksService.deleteStocksFromUser(portfolioId);

      const portfolio = await this.portfolioModel.findOneAndDelete({
        _id: new Types.ObjectId(portfolioId),
        userId: new Types.ObjectId(id),
      });

      if (!portfolio) throw new Error('No portfolio found');

      return portfolio;
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
