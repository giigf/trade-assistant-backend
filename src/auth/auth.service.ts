import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { Role, User } from 'src/user/user.entity';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ResponseToken } from './dto/response.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterInput): Promise<ResponseToken> {
    const emailExist = await this.userRepo.findOne({
      where: { email: data.email },
    });
    if (emailExist) throw new ConflictException('Такой email уже используется');
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepo.save(
      this.userRepo.create({
        ...data,
        password: hashedPassword,
        role: Role.USER,
      }),
    );
    const payload = { id: user.id, email: user.email, role: user.role, tokenVersion: user.tokenVersion };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async login(data: LoginInput): Promise<ResponseToken> {
    const user = await this.userRepo.findOne({ where: { email: data.email } });

    if (!user) {
      throw new UnauthorizedException('Неверный пароль или email');
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль или email');
    }
    const payload = { id: user.id, email: user.email, role: user.role, tokenVersion: user.tokenVersion };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<ResponseToken> {
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepo.findOne({ where: { id: payload.id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (payload.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException('Token version mismatch');
    }

    const newPayload = { id: user.id, email: user.email, role: user.role, tokenVersion: user.tokenVersion };

    const accessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
    const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(user: User) {
    await this.userRepo.update(user.id, { tokenVersion: user.tokenVersion + 1 });
  }
}
