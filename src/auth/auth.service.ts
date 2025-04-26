import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterInput): Promise<string> {
    const emailExist = await this.userRepo.findOne({
      where: { email: data.email },
    });
    if (emailExist) throw new Error('Такой пользователь уже существует');
    const user = await this.userRepo.save(this.userRepo.create(data));
    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return token;
  }

  async login(data: LoginInput): Promise<string> {
    const user = await this.userRepo.findOne({ where: { email: data.email } });

    if (!user || data.password !== user.password) {
      throw new Error('Неверный email или пароль');
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return token;
  }
}
