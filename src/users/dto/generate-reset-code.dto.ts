import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length } from 'class-validator';

export class GenerateResetCodeDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
