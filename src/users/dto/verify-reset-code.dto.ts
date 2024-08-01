import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyResetCodeDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  resetCode: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
