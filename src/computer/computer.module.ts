import { Module } from '@nestjs/common';
import { ComputerService } from './computer.service';
import { ComputerController } from './computer.controller';

@Module({
  controllers: [ComputerController],
  providers: [ComputerService],
})
export class ComputerModule {}
