import { Module } from '@nestjs/common';
import { ComputerService } from './computer.service';
import { ComputerController } from './computer.controller';
import { Computer } from './entities/computer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/auth/jwt.config';

@Module({
  imports: [TypeOrmModule.forFeature([Computer]), JwtModule.registerAsync(jwtConfig)],
  controllers: [ComputerController],
  providers: [ComputerService],
  exports: [TypeOrmModule],
})
export class ComputerModule {}
