// src/database/seeds/trade.seed.ts
import { DataSource } from 'typeorm';
import { Trade } from '../../trade/trade.entity';
import { User } from '../../user/user.entity';
import { TradeFactory } from '../factories/trade.factory';
import { BaseSeed } from './interfaces/seed.interface';

export class TradeSeed extends BaseSeed {
  getName(): string {
    return 'TradeSeed';
  }

  async run(dataSource: DataSource): Promise<void> {
    const tradeRepository = dataSource.getRepository(Trade);
    const userRepository = dataSource.getRepository(User);
    
    console.log('🌱 Создаем трейды...');
    
    // Проверяем, есть ли уже трейды
    const existingTradesCount = await tradeRepository.count();
    if (existingTradesCount > 0) {
      console.log('⚠️  Трейды уже существуют, пропускаем...');
      return;
    }

    // Получаем всех пользователей
    const users = await userRepository.find();
    if (users.length === 0) {
      console.log('❌ Пользователи не найдены. Сначала запустите UserSeed.');
      return;
    }

    // Создаем трейды для каждого пользователя
    for (const user of users) {
      // Пропускаем админа для создания трейдов
      if (user.email === 'admin@example.com') {
        continue;
      }

      // Создаем разные типы трейдов для реалистичности
      const profitableTrades = [
        TradeFactory.createProfitableTrade(user),
        TradeFactory.createProfitableTrade(user),
        TradeFactory.createProfitableTrade(user),
      ];
      
      const losingTrades = [
        TradeFactory.createLosingTrade(user),
        TradeFactory.createLosingTrade(user),
      ];
      
      const ongoingTrades = [
        TradeFactory.createOngoingTrade(user),
      ];
      
      const regularTrades = TradeFactory.createMany(user, 4);

      const allUserTrades = [
        ...profitableTrades,
        ...losingTrades,
        ...ongoingTrades,
        ...regularTrades,
      ];

      const trades = tradeRepository.create(allUserTrades);
      await tradeRepository.save(trades);
      
      console.log(`✅ Создано ${trades.length} трейдов для пользователя ${user.name}`);
    }

    // Создаем дополнительные трейды для тестового пользователя
    const testUser = users.find(u => u.email === 'test@example.com');
    if (testUser) {
      const additionalTrades = TradeFactory.createMany(testUser, 15);
      const trades = tradeRepository.create(additionalTrades);
      await tradeRepository.save(trades);
      console.log(`✅ Создано дополнительно ${trades.length} трейдов для тестового пользователя`);
    }

    const totalTrades = await tradeRepository.count();
    console.log(`🎉 TradeSeed завершен! Всего создано трейдов: ${totalTrades}`);
  }
}