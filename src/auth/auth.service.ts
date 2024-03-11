import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

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
