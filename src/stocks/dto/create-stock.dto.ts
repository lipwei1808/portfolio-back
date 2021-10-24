import {
  IsNumber,
  IsString,
  MinLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { AtLeastZero } from './at-least-zero.validator';

export class CreateStockDto {
  @IsString()
  portfolio: string;

  @IsString()
  type: string;

  @MinLength(1)
  ticker: string;

  @IsNumber()
  @ValidateIf((o) => o.type === 'b')
  @Validate(AtLeastZero)
  entryPrice: number;

  @IsNumber()
  @ValidateIf((o) => o.type === 'b')
  @Validate(AtLeastZero)
  amount: number;

  @IsString()
  @MinLength(1)
  date: string;
}
