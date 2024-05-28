import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ComputerService } from './computer.service';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import { ListComputerDto } from './dto';
import { UUID } from 'crypto';

@Controller('computer')
export class ComputerController {
  constructor(private readonly computerService: ComputerService) {}

  @Post()
  create(@Body() createComputerDto: CreateComputerDto) {
    return this.computerService.create(createComputerDto);
  }

  @Get()
  findAll(@Query() query: ListComputerDto) {
    return this.computerService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: UUID) {
    return this.computerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: UUID, @Body() updateComputerDto: UpdateComputerDto) {
    return this.computerService.update(id, updateComputerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UUID) {
    return this.computerService.remove(id);
  }
}
