// src/seeds/seed-users.ts
import { DataSource } from 'typeorm';
import { User } from '../user/user.entity';
import { config } from 'dotenv';
config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User],
});

async function seed() {
  await dataSource.initialize();

  const repo = dataSource.getRepository(User);

  const users = [
    { name: 'Сид', email: 'seed@example.com' },
    { name: 'Боб', email: 'bob@example.com' },
  ];

  for (const user of users) {
    const existing = await repo.findOneBy({ email: user.email });
    if (!existing) {
      await repo.save(repo.create(user));
    }
  }

  console.log('Сиды успешно добавлены');
  await dataSource.destroy();
}

seed();
