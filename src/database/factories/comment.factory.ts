// src/database/factories/comment.factory.ts (исправленные импорты)
import { Comment } from '../../comments/comments.entity';
import { User } from '../../user/user.entity';
import { Trade } from '../../trade/trade.entity';

export class CommentFactory {
  static create(user: User, trade: Trade, overrides: Partial<Comment> = {}): Partial<Comment> {
    const comments = [
      'Отличная сделка! Все прошло по плану.',
      'Стоило бы войти раньше, но результат хороший.',
      'Эмоции взяли верх, в следующий раз буду осторожнее.',
      'Технический анализ сработал на 100%.',
      'Новости сильно повлияли на движение.',
      'Долго ждал подходящий момент для входа.',
      'Риск-менеджмент спас от больших потерь.',
      'Нужно улучшить точки входа и выхода.',
      'Рынок непредсказуем, но стратегия работает.',
      'Психология торговли - самое сложное.',
      'Отличный тайминг входа в позицию.',
      'Стоп-лосс сработал как надо.',
      'Жадность чуть не испортила результат.',
      'Фундаментальный анализ был верным.',
      'Волатильность сыграла на руку.',
    ];
    
    const randomComment = comments[Math.floor(Math.random() * comments.length)];
    const randomDate = new Date(
      trade.date_start.getTime() + 
      Math.random() * (trade.date_end.getTime() - trade.date_start.getTime())
    );
    
    return {
      user,
      trade,
      text: randomComment,
      date: randomDate,
      ...overrides,
    };
  }

  static createMany(
    user: User, 
    trade: Trade, 
    count: number, 
    overrides: Partial<Comment> = {}
  ): Partial<Comment>[] {
    const comments: Partial<Comment>[] = [];
    
    for (let i = 0; i < count; i++) {
      comments.push(this.create(user, trade, {
        date: new Date(
          trade.date_start.getTime() + 
          (i + 1) * ((trade.date_end.getTime() - trade.date_start.getTime()) / (count + 1))
        ),
        ...overrides,
      }));
    }
    
    return comments;
  }

  static createMultipleUsers(
    users: User[], 
    trade: Trade, 
    overrides: Partial<Comment> = {}
  ): Partial<Comment>[] {
    return users.map(user => this.create(user, trade, overrides));
  }
}