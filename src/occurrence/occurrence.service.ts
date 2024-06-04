import { Injectable } from '@nestjs/common';
import { CreateOccurrenceDto, CreateOccurrenceFiles } from './dto/create-occurrence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Occurrence } from './entities/occurrence.entity';
import { Between, Like, Repository } from 'typeorm';
import { createFile } from 'src/common/storage.helper';
import { ListAllOccurence } from './dto';
import { format } from 'date-fns';

@Injectable()
export class OccurrenceService {
  constructor(
    @InjectRepository(Occurrence) private readonly occurrenceRepository: Repository<Occurrence>,
  ) {}

  async create(body: CreateOccurrenceDto, files: CreateOccurrenceFiles) {
    const createdAt = new Date(new Date().toUTCString()).getTime();
    const frameFilePath = `storage/${createdAt}_frame_${body.user}.jpg`;
    const printFilePath = `storage/${createdAt}_print_${body.user}.jpg`;

    createFile(frameFilePath, files.frame[0].buffer);
    createFile(printFilePath, files.print[0].buffer);

    this.occurrenceRepository.save({
      frameFilePath,
      printFilePath,
      user: body.user,
      createdAt: new Date(createdAt).toISOString(),
    });
  }

  async findAll(query: ListAllOccurence) {
    const startTime = format(new Date(+query.startTime).toUTCString(), 'yyyy-MM-dd HH:mm:SS');
    const endTime = format(new Date(+query.endTime).toUTCString(), 'yyyy-MM-dd HH:mm:SS');

    const [data, total] = await this.occurrenceRepository.findAndCount({
      where: {
        user: Like(`%${query.username || ''}%`),
        createdAt: Between(startTime, endTime),
      },
      order: { user: 'ASC', createdAt: 'DESC' },
      take: query.pageSize,
      skip: (query.page - 1) * query.pageSize,
    });

    const totalRegister = await this.occurrenceRepository.count();

    return {
      data,
      total,
      totalRegister,
      totalPages: Math.ceil(totalRegister / query.pageSize),
    };
  }

  findOne(id: number) {
    return this.occurrenceRepository.findOneBy({ id });
  }
}
