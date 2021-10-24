import { Expose } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  name: string;

  @Expose()
  email: string;
}
