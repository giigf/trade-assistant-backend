// src/database/factories/trade.factory.ts
import { Trade } from '../../trade/trade.entity';
import { User } from '../../user/user.entity';

export class TradeFactory {
  static create(user: User, overrides: Partial<Trade> = {}): Partial<Trade> {
    const now = new Date();
    const startDate = new Date(now.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000);
    
    const startPrice = +(Math.random() * (200 - 50) + 50).toFixed(2);
    const priceChange = (Math.random() * 20 - 10); // от -10 до +10
    const endPrice = +(startPrice + priceChange).toFixed(2);
    
    const notes = [
      'Хорошая точка входа, следовал плану',
      'Сработал стоп-лосс, убыток небольшой',
      'Отличная прибыль, закрыл по тейк-профиту',
      'Долгосрочная позиция, держу до цели',
      'Эмоциональный вход, нужно работать над дисциплиной',
      'Технический анализ показал правильное направление',
      'Новости повлияли на движение цены'
    ];
    
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    
    return {
      userId: user.id,
      user,
      date_start: startDate,
      date_end: endDate,
      start_price: startPrice,
      end_price: endPrice,
      note: randomNote,
      ...overrides,
    };
  }

  static createMany(user: User, count: number, overrides: Partial<Trade> = {}): Partial<Trade>[] {
    const trades: Partial<Trade>[] = [];
    
    for (let i = 0; i < count; i++) {
      trades.push(this.create(user, overrides));
    }
    
    return trades;
  }

  static createProfitableTrade(user: User, overrides: Partial<Trade> = {}): Partial<Trade> {
    const startPrice = +(Math.random() * (200 - 50) + 50).toFixed(2);
    const profitMargin = Math.random() * 10 + 5; // от 5 до 15 прибыли
    const endPrice = +(startPrice + profitMargin).toFixed(2);
    
    return this.create(user, {
      start_price: startPrice,
      end_price: endPrice,
      note: 'Прибыльная сделка - цель достигнута!',
      ...overrides,
    });
  }

  static createLosingTrade(user: User, overrides: Partial<Trade> = {}): Partial<Trade> {
    const startPrice = +(Math.random() * (200 - 50) + 50).toFixed(2);
    const lossMargin = Math.random() * 8 + 2; // от 2 до 10 убытка
    const endPrice = +(startPrice - lossMargin).toFixed(2);
    
    return this.create(user, {
      start_price: startPrice,
      end_price: endPrice,
      note: 'Сработал стоп-лосс, убыток контролируемый',
      ...overrides,
    });
  }

  static createOngoingTrade(user: User, overrides: Partial<Trade> = {}): Partial<Trade> {
    const now = new Date();
    const startDate = new Date(now.getTime() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000);
    const startPrice = +(Math.random() * (200 - 50) + 50).toFixed(2);
    
    return this.create(user, {
      date_start: startDate,
      date_end: now, // Текущая позиция
      start_price: startPrice,
      end_price: startPrice, // Пока цена не изменилась значительно
      note: 'Позиция открыта, жду развития ситуации',
      ...overrides,
    });
  }
}