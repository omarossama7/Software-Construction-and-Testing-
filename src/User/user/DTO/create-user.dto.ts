import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsNumber, Min, IsUrl, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character'
  })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsUrl()
  @Matches(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
  @IsOptional()
  prof_pic?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  salary?: number;}