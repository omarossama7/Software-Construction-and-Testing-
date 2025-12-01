import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, Bill, Investment, Spending } from '../Schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async addBill(userId: string, bill: Bill): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { bill: bill } },
      { new: true }
    );
  }

  async updateBill(userId: string, billId: string, updates: Partial<Bill>): Promise<User | null> {
    return this.userModel.findOneAndUpdate(
      { _id: userId, 'bill.id': billId },
      { $set: { 'bill.$': { ...updates, id: billId } } },
      { new: true }
    );
  }

  async addInvestment(userId: string, investment: Investment): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { investment: investment } },
      { new: true }
    );
  }

  async updateInvestment(userId: string, investmentId: string, updates: Partial<Investment>): Promise<User | null> {
    return this.userModel.findOneAndUpdate(
      { _id: userId, 'investment.id': investmentId },
      { $set: { 'investment.$': { ...updates, id: investmentId } } },
      { new: true }
    );
  }

  async addSpending(userId: string, spending: Spending): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { spending: spending } },
      { new: true }
    );
  }

  async updateSpending(userId: string, spendingId: string, updates: Partial<Spending>): Promise<User | null> {
    return this.userModel.findOneAndUpdate(
      { _id: userId, 'spending.id': spendingId },
      { $set: { 'spending.$': { ...updates, id: spendingId } } },
      { new: true }
    );
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