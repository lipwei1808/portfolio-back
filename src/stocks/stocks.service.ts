import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateStockDto } from './dto/create-stock.dto';
import { Stock, StockDocument } from './schemas/stock.schema';

@Injectable()
export class StocksService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<StockDocument>,
  ) {}

  addStock(createStockDto: CreateStockDto, id: string) {
    const objectId = new Types.ObjectId(id);
    const createdStock = new this.stockModel({
      ...createStockDto,
      portfolio: new Types.ObjectId(createStockDto.portfolio),
      userId: objectId,
    });
    return createdStock.save();
  }

  async getStocks(id: string) {
    const data = await this.stockModel
      .find({ userId: new Types.ObjectId(id) })
      .populate({ path: 'portfolio' });
    return data;
  }

  getConsolidatedStocks(id: string, portfolio: string) {
    return this.stockModel.aggregate([
      { $match: { userId: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'portfolios',
          localField: 'portfolio',
          foreignField: '_id',
          as: 'portfolio',
        },
      },
      {
        $addFields: {
          portfolioName: '$portfolio._id',
        },
      },
      {
        $match: {
          portfolioName: portfolio
            ? new Types.ObjectId(portfolio)
            : { $exists: true },
        },
      },
      {
        $addFields: {
          totalValue: { $multiply: ['$entryPrice', '$amount'] },
        },
      },
      {
        $group: {
          _id: '$ticker',
          amount: { $sum: '$amount' },
          totalValue: { $sum: '$totalValue' },
        },
      },
      {
        $match: {
          amount: { $gt: 0 },
        },
      },
      {
        $addFields: {
          avgPrice: { $divide: ['$totalValue', '$amount'] },
        },
      },
    ]);
  }

  getDistribution(id: string) {
    return this.stockModel.aggregate([
      { $match: { userId: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'portfolios',
          localField: 'portfolio',
          foreignField: '_id',
          as: 'portfolio',
        },
      },
      { $unwind: '$portfolio' },
      {
        $addFields: {
          totalValue: { $multiply: ['$entryPrice', '$amount'] },
          portfolioName: '$portfolio.name',
        },
      },
      {
        $group: {
          _id: '$portfolio.name',
          value: {
            $sum: '$totalValue',
          },
        },
      },
    ]);
  }

  deleteStocksFromUser(userId: string) {
    return this.stockModel.deleteMany({
      portfolio: new Types.ObjectId(userId),
    });
  }

  deleteStock(userId: string, stockId: string) {
    return this.stockModel.deleteMany({
      userId: new Types.ObjectId(userId),
      _id: new Types.ObjectId(stockId),
    });
  }
}
