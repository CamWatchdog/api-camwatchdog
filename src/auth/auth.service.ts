import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Computer } from 'src/computer/entities/computer.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Computer) private readonly computerRepository: Repository<Computer>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: username });

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
  }

  async validateComputer(description: string) {
    const computer = await this.computerRepository.findOneBy({ description });

    return computer;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { name: user.name, id: user.id, cpf: user.cpf, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
