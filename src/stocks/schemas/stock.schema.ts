import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type StockDocument = Stock & Document;

@Schema()
export class Stock {
  @Prop()
  type: string;

  @Prop()
  ticker: string;

  @Prop()
  entryPrice: number;

  @Prop()
  amount: number;

  @Prop()
  date: string;

  @Prop({ type: Types.ObjectId, ref: 'Portfolio' })
  portfolio: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
}

export const StockSchema = SchemaFactory.createForClass(Stock);
