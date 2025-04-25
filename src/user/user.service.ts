// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  createUser(data: CreateUserInput): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new Error('Пользователь не найден. Может, он и не существовал никогда.');
    }
    return user;
  }
  async updateUser(data: UpdateUserInput): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: data.id } });
    if (!user) throw new Error('Такого юзера нет. И не было.');
    Object.assign(user, data);
    return this.userRepo.save(user);
  }
  async deleteUser(id: number): Promise<boolean> {
    const res = await this.userRepo.delete(id);
    return (res.affected ?? 0) > 0;
  }
}
