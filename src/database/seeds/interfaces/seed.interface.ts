// src/database/seeds/interfaces/seed.interface.ts
import { DataSource } from 'typeorm';

export abstract class BaseSeed {
  abstract getName(): string;
  abstract run(dataSource: DataSource): Promise<void>;
}
