import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { AuthEncryptationService } from './services/auth-encryptation.service.js';
import { DatabaseHelpers } from '../common/providers/database-helpers.js';
import { JwtPayload } from './interfaces/interfaces.js';
import { RegisterDto, LoginDto } from './dto/index.js';
import { User } from './entities/user.entity.js';
import { UserResource } from './resources/user.resource.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly encryptationService: AuthEncryptationService,
    private readonly jwtService: JwtService,
    private readonly databaseHelpers: DatabaseHelpers
  ) { }

  async register(registerDto: RegisterDto) {
    try {
      const { password, ...userData } = registerDto;
      const hashPassword = this.encryptationService.hashPassword(password);
      const user = this.userRepository.create({ ...userData, password: hashPassword });
      const dbUser = await this.userRepository.save(user);

      return UserResource.authUser(user, this.getJwtToken({ id: dbUser.id }));
    } catch (error) {
      this.databaseHelpers.handleExeptions(error);
    }
  }

  async login(loginDto: LoginDto) {
    const { password, email } = loginDto;
    const user = await this.userRepository.findOne({ where: { email, isActive: true } });

    if (!user) throw new UnauthorizedException("The user is not active, please comunicate with the administrator");
    this.encryptationService.checkPassword(user.password, password);

    return UserResource.authUser(user, this.getJwtToken({ id: user.id }));
  }

  async checkStatus(user: User) {
    return UserResource.authUser(user, this.getJwtToken({ id: user.id }));
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
