import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
    minLength: [
      6,
      'Must be at least 6 characters! Provided length was {VALUE}',
    ],
  })
  password: string;

  @Prop()
  balance: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
