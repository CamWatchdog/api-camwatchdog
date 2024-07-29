import { Controller, Post, Body, UseInterceptors, UploadedFiles, Get, Query } from '@nestjs/common';
import { OccurrenceService } from './occurrence.service';
import { CreateOccurrenceDto, CreateOccurrenceFiles } from './dto/create-occurrence.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ComputerKey } from '../auth/jwt.strategy';
import { ListAllOccurence } from './dto';

@Controller('api')
export class OccurrenceController {
  constructor(private readonly apiService: OccurrenceService) {}

  @Post()
  @ComputerKey()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'frame', maxCount: 1 },
      { name: 'print', maxCount: 1 },
    ]),
  )
  create(@Body() body: CreateOccurrenceDto, @UploadedFiles() files: CreateOccurrenceFiles) {
    return this.apiService.create(body, files);
  }

  @Get('findAll')
  findAll(@Query() query: ListAllOccurence) {
    return this.apiService.findAll(query);
  }
}
