// src/database/factories/user.factory.ts
import { User, Role } from '../../user/user.entity';
import * as bcrypt from 'bcrypt';

export class UserFactory {
  static async create(overrides: Partial<User> = {}): Promise<Partial<User>> {
    const defaultPassword = await bcrypt.hash('password123', 10);
    
    return {
      name: 'Test User ' + Math.random().toString(36).substring(7),
      email: `test${Math.random().toString(36).substring(7)}@example.com`,
      password: defaultPassword,
      role: Role.USER,
      tokenVersion: 0,
      ...overrides,
    };
  }

  static async createAdmin(overrides: Partial<User> = {}): Promise<Partial<User>> {
    const defaultPassword = await bcrypt.hash('admin123', 10);
    
    return {
      name: 'Admin User ' + Math.random().toString(36).substring(7),
      email: `admin${Math.random().toString(36).substring(7)}@example.com`,
      password: defaultPassword,
      role: Role.ADMIN,
      tokenVersion: 0,
      ...overrides,
    };
  }

  static async createMany(count: number, overrides: Partial<User> = {}): Promise<Partial<User>[]> {
    const users: Partial<User>[] = [];
    
    for (let i = 0; i < count; i++) {
      users.push(await this.create({
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        ...overrides,
      }));
    }
    
    return users;
  }
}