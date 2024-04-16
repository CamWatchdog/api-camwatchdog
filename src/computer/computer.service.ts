import { Injectable } from '@nestjs/common';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import { Computer } from './entities/computer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ListComputerDto } from './dto';

@Injectable()
export class ComputerService {
  constructor(
    @InjectRepository(Computer) private readonly computerRepository: Repository<Computer>,
  ) {}

  create(createComputerDto: CreateComputerDto) {
    this.computerRepository.save(createComputerDto);
  }

  async findAll(query: ListComputerDto) {
    const [data, total] = await this.computerRepository.findAndCount({
      where: {
        description: Like(`%${query.description || ''}%`),
      },
      order: { description: 'ASC', createdAt: 'DESC' },
      take: query.pageSize,
      skip: (query.page - 1) * query.pageSize,
    });

    const totalRegister = await this.computerRepository.count();

    return {
      data,
      total,
      totalRegister,
      totalPages: Math.ceil(total / query.pageSize),
    };
  }

  findOne(id: number) {
    return this.computerRepository.findOne({ where: { id } });
  }

  update(id: number, updateComputerDto: UpdateComputerDto) {
    return this.computerRepository.update(id, updateComputerDto);
  }

  remove(id: number) {
    this.computerRepository.update(id, { isActive: false });
  }
}
