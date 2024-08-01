import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ListUserDto } from './dto';
import { UUID } from 'crypto';
import { GenerateResetCodeDto } from './dto/generate-reset-code.dto';
import { VerifyResetCodeDto } from './dto/verify-reset-code.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

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
      if (this.comparePassword(updateUserDto.password, updateUserDto.currentPassword)) {
        updateUserDto.password = await this.genCryptedPassword(updateUserDto.password);
      } else {
        throw new BadRequestException('Current password is incorrect!');
      }
      delete updateUserDto.currentPassword;
    }
    return await this.userRepository.update({ userId }, updateUserDto);
  }

  async remove(userId: UUID) {
    return await this.userRepository.update(userId, { isActive: 2 });
  }

  private async genCryptedPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async generateAndSendNewResetCode(generateResetCodeDto: GenerateResetCodeDto) {
    const token = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    const user = await this.userRepository.findOne({
      where: { email: generateResetCodeDto.email },
    });

    if (!user) {
      throw new BadRequestException('User not found!');
    }

    const userUpdated = await this.userRepository.update({ email: user.email }, { token: token });

    if (userUpdated.affected > 0) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'CamWatchDog Confirmation Code',
        html: `<h1>Token: ${token}</h1>`,
      };

      await this.mailerService.sendMail(mailOptions);
    } else {
      throw new HttpException('Error in update user!', 500);
    }
  }

  async verifyResetPasswordCode(verifyResetPasswordCode: VerifyResetCodeDto) {
    const user = await this.userRepository.findOne({
      where: { email: verifyResetPasswordCode.email },
    });

    if (!user) {
      throw new BadRequestException('User not found!');
    }
    
    if (user.token.toString() !== verifyResetPasswordCode.resetCode) {
      throw new BadRequestException('Reset code incorrect!');
    }

    if (verifyResetPasswordCode.password !== verifyResetPasswordCode.confirmPassword) {
      throw new BadRequestException('Passwords dont match!');
    }

    await this.userRepository.update(
      { email: user.email },
      { password: await this.genCryptedPassword(verifyResetPasswordCode.password) },
    );
  }
}
