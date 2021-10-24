import { IsString, IsOptional, MinLength, IsNumber } from 'class-validator';

export class UpdatedUserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsNumber()
  @IsOptional()
  balance: number;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password: string;
}
