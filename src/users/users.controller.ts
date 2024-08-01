import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListUserDto } from './dto';
import { Public } from 'src/auth/jwt.strategy';
import { UUID } from 'crypto';
import { VerifyResetCodeDto } from './dto/verify-reset-code.dto';
import { GenerateResetCodeDto } from './dto/generate-reset-code.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: ListUserDto) {
    return this.userService.findAll(query);
  }

  @Get(':userId')
  findOne(@Param('userId') userId: UUID) {
    return this.userService.findOne(userId);
  }

  @Patch(':userId')
  update(@Param('userId') userId: UUID, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: UUID) {
    return this.userService.remove(userId);
  }
  
  @Public()
  @Post('/sendResetCode')
  @HttpCode(204)
  generateAndSendNewResetCode(@Body() generateResetCodeDto: GenerateResetCodeDto) {
    return this.userService.generateAndSendNewResetCode(generateResetCodeDto);
  }

  @Public()
  @Post('/verifyResetCode')
  @HttpCode(204)
  verifyResetPasswordCode(@Body() verifyResetCodeDto: VerifyResetCodeDto) {
    return this.userService.verifyResetPasswordCode(verifyResetCodeDto);
  }
}
