import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmpty, IsInt, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsString()
  password?: string;
}
