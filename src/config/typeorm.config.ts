
// src/config/typeorm.config.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../user/user.entity';
import { Trade } from '../trade/trade.entity';
import { Comment } from '../comments/comments.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || '15122005',
  database: process.env.DATABASE_NAME || 'nest_users',
  entities: [User, Trade, Comment],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: process.env.NODE_ENV === 'development', // Только для разработки!
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;