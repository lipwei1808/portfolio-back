import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type PortfolioDocument = Portfolio & Document;

@Schema()
export class Portfolio {
  @Prop()
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
