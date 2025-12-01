import { Injectable, NotFoundException, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../User/Schema/user.schema';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { LogoutDto } from './dto/logout.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async signup(signUpDto: SignUpDto) {
    const existingUser = await this.userModel.findOne({ email: signUpDto.email }).exec();
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    
    const newUser = new this.userModel({
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      email: signUpDto.email,
      password: hashedPassword,
      currency: signUpDto.currency || 'USD',
      salary: 0,
      bill: [],
      investment: [],
      spending: []
    });

    const savedUser = await newUser.save();

    return {
      message: 'User registered successfully',
      user: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        currency: savedUser.currency
      }
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email }).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken();

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        currency: user.currency,
        salary: user.salary,
        prof_pic: user.prof_pic
      }
    };
  }

  async logout(logoutDto: LogoutDto) {
    const user = await this.userModel.findOne({ id: logoutDto.userId }).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'Logout successful'
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ id: forgotPasswordDto.userId }).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(forgotPasswordDto.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(forgotPasswordDto.newPassword)) {
      throw new BadRequestException('New password must contain at least one uppercase letter, one lowercase letter, and one number');
    }

    const hashedNewPassword = await bcrypt.hash(forgotPasswordDto.newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return {
      message: 'Password updated successfully'
    };
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      currency: user.currency,
      salary: user.salary,
      prof_pic: user.prof_pic,
      bill: user.bill,
      investment: user.investment,
      spending: user.spending
    };
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  }}