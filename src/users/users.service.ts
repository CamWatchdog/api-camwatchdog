import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ListUserDto } from './dto';
import { UUID } from 'crypto';

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

    const mappedData = data.map((user) => ({
      id: user.id,
      userId: user.userId,
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: user.role,
    }));

    return {
      data: mappedData,
      total,
      totalRegister,
      totalPages: Math.ceil(total / query.pageSize),
    };
  }

  async findOne(userId: UUID) {
    return await this.userRepository.findOne({ where: { userId } });
  }

  async update(userId: UUID, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.genCryptedPassword(updateUserDto.password);
    }
    return await this.userRepository.update({ userId }, updateUserDto);
  }

  async remove(userId: UUID) {
    return await this.userRepository.update(userId, { isActive: 2 });
  }

  async changeUserPassword(
    userId: UUID,
    changeUserPasswordDto: { currentPassword: string; newPassword: string },
  ) {
    const user = await this.findOne(userId);
    const isSamePasswor = await this.comparePassword(
      changeUserPasswordDto.currentPassword,
      user.password,
    );

    if (!user) {
      throw new NotFoundException('User not found!');
    } else if (user && !isSamePasswor) {
      throw new BadRequestException('Current password is incorrect!');
    }
    return await this.userRepository.update(
      { userId },
      {
        password: await this.genCryptedPassword(changeUserPasswordDto.newPassword),
      },
    );
  }

  private async genCryptedPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
