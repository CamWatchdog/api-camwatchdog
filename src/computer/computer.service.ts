import { Injectable } from '@nestjs/common';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import { Computer } from './entities/computer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { ListComputerDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { UUID } from 'crypto';
import { format } from 'date-fns';

@Injectable()
export class ComputerService {
  constructor(
    @InjectRepository(Computer) private readonly computerRepository: Repository<Computer>,
    private readonly jwtService: JwtService,
  ) {}

  create(createComputerDto: CreateComputerDto) {
    const token = this.jwtService.sign({ description: createComputerDto.description });
    const computer = {
      ...createComputerDto,
      token,
    };

    this.computerRepository.save(computer);

    return token;
  }

  async findAll(
    query: ListComputerDto = { description: '', page: 1, pageSize: 10, startTime: 0, endTime: 0 },
  ) {
    const startTime = format(new Date(+query.startTime).toUTCString(), 'yyyy-MM-dd HH:mm:SS');
    const endTime = format(
      query.endTime && +query.endTime > 0
        ? new Date(+query.endTime).toUTCString()
        : new Date().toUTCString(),
      'yyyy-MM-dd HH:mm:SS',
    );

    const [data, total] = await this.computerRepository.findAndCount({
      where: {
        description: Like(`%${query.description || ''}%`),
        isActive: 1,
        createdAt: Between(startTime, endTime),
      },
      order: { description: 'ASC', createdAt: 'DESC' },
      take: query.pageSize,
      skip: (query.page - 1) * query.pageSize,
    });

    const totalRegister = await this.computerRepository.count({ where: { isActive: 1 } });

    return {
      data,
      total,
      totalRegister,
      totalPages: Math.ceil(totalRegister / query.pageSize),
    };
  }

  findOne(id: UUID) {
    return this.computerRepository.findOne({ where: { computerId: id, isActive: 1 } });
  }

  async update(id: UUID, updateComputerDto: UpdateComputerDto) {
    const computer = {
      ...updateComputerDto,
      token: this.jwtService.sign({ description: updateComputerDto.description }),
    };
    await this.computerRepository.update({ computerId: id }, computer);
    return (await this.findOne(id)).token;
  }

  async remove(id: UUID) {
    await this.computerRepository.update({ computerId: id }, { isActive: 0 });
  }
}
