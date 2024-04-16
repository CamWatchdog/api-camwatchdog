import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ListUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.genCryptedPassword(createUserDto.password);

    return await this.userRepository.save(createUserDto);
  }

  async findAll(query: ListUserDto) {
    const [data, total] = await this.userRepository.findAndCount({
      where: [
        {
          cpf: Like(`%${query.search || ''}%`),
        },
        {
          email: Like(`%${query.search || ''}%`),
        },
        {
          name: Like(`%${query.search || ''}%`),
        },
      ],
      order: { name: 'ASC', cpf: 'ASC', email: 'ASC' },
      take: query.pageSize,
      skip: (query.page - 1) * query.pageSize,
    });

    const totalRegister = await this.userRepository.count();

    return {
      data,
      total,
      totalRegister,
      totalPages: Math.ceil(total / query.pageSize),
    };
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.genCryptedPassword(updateUserDto.password);
    }
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.update(id, { isActive: false });
  }

  async changeUserPassword(id: number, password: string) {
    return await this.userRepository.update(id, {
      password: await this.genCryptedPassword(password),
    });
  }

  private async genCryptedPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
