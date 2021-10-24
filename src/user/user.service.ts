import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdatedUserDto } from '../auth/dto/updated-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async addUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Check if user exists
    const user = await this.userModel.findOne({ email: createUserDto.email });

    if (user) {
      throw new Error('User exists already!');
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findUser(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return null;
    }
    return user;
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      return null;
    }

    return user;
  }

  // TODO: check if email change is used
  async updateUser(id: string, updatedUserDto: UpdatedUserDto) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updatedUserDto,
      { new: true },
    );
    if (!user) {
      return null;
    }
    return user;
  }

  async getBalance(id: string) {
    const user = await this.userModel.findById(new Types.ObjectId(id));
    return user.balance;
  }

  async editBalance(amount, id: string) {
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(id) });
    let updatedUser;
    if (user.balance) {
      updatedUser = await this.userModel.findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        { balance: user.balance + amount },
        { new: true },
      );
    } else {
      updatedUser = await this.userModel.findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        { balance: amount },
        { new: true },
      );
    }
    if (!updatedUser) return null;

    return updatedUser;
  }
}
