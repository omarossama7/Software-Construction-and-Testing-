import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { Bill, Investment, Spending } from '../Schema/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post(':id/bills')
  addBill(@Param('id') userId: string, @Body() bill: Bill) {
    return this.userService.addBill(userId, bill);
  }

  @Post(':id/investments')
  addInvestment(@Param('id') userId: string, @Body() investment: Investment) {
    return this.userService.addInvestment(userId, investment);
  }

  @Post(':id/spendings')
  addSpending(@Param('id') userId: string, @Body() spending: Spending) {
    return this.userService.addSpending(userId, spending);
  }

  @Patch(':id/bills/:billId')
  updateBill(@Param('id') userId: string, @Param('billId') billId: string, @Body() updates: Partial<Bill>) {
    return this.userService.updateBill(userId, billId, updates);
  }

  @Patch(':id/investments/:investmentId')
  updateInvestment(@Param('id') userId: string, @Param('investmentId') investmentId: string, @Body() updates: Partial<Investment>) {
    return this.userService.updateInvestment(userId, investmentId, updates);
  }

  @Patch(':id/spendings/:spendingId')
  updateSpending(@Param('id') userId: string, @Param('spendingId') spendingId: string, @Body() updates: Partial<Spending>) {
    return this.userService.updateSpending(userId, spendingId, updates);
  }

  @Get(':id/totals')
  getTotals(@Param('id') userId: string) {
    return this.userService.getTotals(userId);
  }
}