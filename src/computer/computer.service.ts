import { Injectable } from '@nestjs/common';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import { Computer } from './entities/computer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { ListComputerDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { UUID, randomUUID } from 'crypto';

@Injectable()
export class ComputerService {
  constructor(
    @InjectRepository(Computer) private readonly computerRepository: Repository<Computer>,
    private readonly jwtService: JwtService,
  ) {}

  create(createComputerDto: CreateComputerDto) {
    const computerId = randomUUID();
    const token = this.jwtService.sign(
      { description: createComputerDto.description, computerId },
      { expiresIn: '0' },
    );
    const computer = {
      ...createComputerDto,
      computerId,
      token,
    };

    this.computerRepository.save(computer);

    return token;
  }

  async findAll(
    query: ListComputerDto = { description: '', page: 1, pageSize: 10, startTime: 0, endTime: 0 },
  ) {
    const startTime =
      query.startTime && +query.startTime > 0
        ? new Date(+query.startTime).toISOString()
        : new Date(0).toISOString();
    const endTime =
      query.endTime && +query.endTime > 0
        ? new Date(+query.endTime).toISOString()
        : new Date().toISOString();

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

    const totalRegister = await this.computerRepository.count({
      where: {
        description: Like(`%${query.description || ''}%`),
        isActive: 1,
        createdAt: Between(startTime, endTime),
      },
    });

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

  findByComputerId(id: UUID) {
    return this.computerRepository.findOne({ where: { computerId: id } });
  }

  async findMapped() {
    const result = await this.computerRepository.find({ where: { isActive: 1 } });
    return result.map((computer) => {
      return {
        description: computer.description,
        computerId: computer.computerId,
      };
    });
  }

  async update(id: UUID, updateComputerDto: UpdateComputerDto) {
    const computer = {
      ...updateComputerDto,
      token: this.jwtService.sign({ description: updateComputerDto.description, computerId: id }),
    };
    await this.computerRepository.update({ computerId: id }, computer);
    return (await this.findOne(id)).token;
  }

  async remove(id: UUID) {
    await this.computerRepository.update({ computerId: id }, { isActive: 0 });
  }
}
