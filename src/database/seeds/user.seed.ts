// src/database/seeds/user.seed.ts
import { DataSource } from 'typeorm';
import { User, Role } from '../../user/user.entity';
import { UserFactory } from '../factories/user.factory';
import { BaseSeed } from './interfaces/seed.interface';

export class UserSeed extends BaseSeed {
  getName(): string {
    return 'UserSeed';
  }

  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    
    console.log('🌱 Создаем пользователей...');
    
    // Проверяем, есть ли уже пользователи
    const existingUsersCount = await userRepository.count();
    if (existingUsersCount > 0) {
      console.log('⚠️  Пользователи уже существуют, пропускаем...');
      return;
    }

    // Создаем админа
    const adminData = await UserFactory.createAdmin({
      name: 'Admin User',
      email: 'admin@example.com',
    });
    const admin = userRepository.create(adminData);
    await userRepository.save(admin);
    console.log('✅ Создан админ:', admin.name);

    // Создаем тестового пользователя
    const testUserData = await UserFactory.create({
      name: 'Test User',
      email: 'test@example.com',
    });
    const testUser = userRepository.create(testUserData);
    await userRepository.save(testUser);
    console.log('✅ Создан тестовый пользователь:', testUser.name);

    // Создаем трейдеров с реалистичными именами
    const traderNames = [
      { name: 'Алексей Петров', email: 'alexey.petrov@example.com' },
      { name: 'Мария Сидорова', email: 'maria.sidorova@example.com' },
      { name: 'Дмитрий Козлов', email: 'dmitry.kozlov@example.com' },
      { name: 'Анна Волкова', email: 'anna.volkova@example.com' },
      { name: 'Сергей Новиков', email: 'sergey.novikov@example.com' },
    ];

    for (const traderData of traderNames) {
      const userData = await UserFactory.create(traderData);
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log('✅ Создан трейдер:', user.name);
    }

    const totalUsers = await userRepository.count();
    console.log(`🎉 UserSeed завершен! Всего создано пользователей: ${totalUsers}`);
  }
}