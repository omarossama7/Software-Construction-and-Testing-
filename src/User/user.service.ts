import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, Bill, Investment, Spending } from '../Schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto'; //assume you have a Create/updateUserDto.  
import { UpdateUserDto } from './dto/update-user.dto'; //reminder to contact omar for common names

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }
  
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async getUser(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  async updateUser(id: string, updates: UpdateUserDto): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updates, { new: true });
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id);
  } 

  async getTotals(userId: string) {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const billsTotal = user.bill.reduce((sum, bill) => sum + bill.amountNeeded, 0);
    const investmentsTotal = user.investment.reduce((sum, inv) => sum + inv.amountNeeded, 0);
    const spendingTotal = user.spending.reduce((sum, spend) => sum + spend.amountDeposited, 0);
    
    return { billsTotal, investmentsTotal, spendingTotal };
  }
}