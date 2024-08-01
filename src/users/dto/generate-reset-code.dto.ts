import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GenerateResetCodeDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
