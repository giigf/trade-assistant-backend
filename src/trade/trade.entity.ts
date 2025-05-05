// src/trade/trade.entity.ts
import { User } from '../user/user.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('trades')
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.trades, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'timestamp' })
  date_start: Date;

  @Column({ type: 'timestamp' })
  date_end: Date;

  @Column()
  note: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  start_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  end_price: number;
}
