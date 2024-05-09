import { Injectable } from '@nestjs/common';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import { Computer } from './entities/computer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ListComputerDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ComputerService {
  constructor(
    @InjectRepository(Computer) private readonly computerRepository: Repository<Computer>,
    private readonly jwtService: JwtService,
  ) {}

  create(createComputerDto: CreateComputerDto) {
    const computer = {
      ...createComputerDto,
      token: this.jwtService.sign({ description: createComputerDto.description }),
    };

    this.computerRepository.save(computer);
  }

  async findAll(
    query: ListComputerDto = { description: '', page: 1, pageSize: 10, startTime: '', endTime: '' },
  ) {
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
    const computer = {
      ...updateComputerDto,
      token: this.jwtService.sign({ description: updateComputerDto.description }),
    };
    return this.computerRepository.update(id, computer);
  }

  remove(id: number) {
    this.computerRepository.update(id, { isActive: false });
  }
}
