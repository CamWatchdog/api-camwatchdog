import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { nome: user.nome, id: user.id, cpf: user.CPF };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
