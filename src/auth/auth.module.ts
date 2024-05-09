import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { jwtConfig } from './jwt.config';
import { UsersModule } from 'src/users/users.module';
import { Computer } from 'src/computer/entities/computer.entity';
import { ComputerModule } from 'src/computer/computer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Computer]),
    PassportModule,
    JwtModule.registerAsync(jwtConfig),
    UsersModule,
    ComputerModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
