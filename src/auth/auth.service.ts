import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email: username });

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { name: user.name, id: user.id, cpf: user.cpf, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
