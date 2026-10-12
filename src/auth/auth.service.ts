import { AuthEncryptationService } from './services/auth-encryptation.service.js';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/index.js';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { UserResource } from './resources/user.resource.js';
import { JwtPayload } from './interfaces/interfaces.js';
import { serialize } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly encryptationService: AuthEncryptationService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    try {
      const { password, ...userData } = registerDto;
      const hashPassword = this.encryptationService.hashPassword(password);
      const user = this.userRepository.create({ ...userData, password: hashPassword });
      const dbUser = await this.userRepository.save(user);

      return UserResource.authUser(user, this.getJwtToken({ id: dbUser.id }));
    } catch (error) {
      console.log(error);
    }
  }

  async login(loginDto: LoginDto) {
    const { password, email } = loginDto;
    const user = await this.userRepository.findOne({ where: { email, isActive: true } });

    if (!user) throw new UnauthorizedException("The user is not active, please comunicate with the administrator");
    this.encryptationService.checkPassword(user.password, password);

    return UserResource.authUser(user, this.getJwtToken({ id: user.id }));
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
