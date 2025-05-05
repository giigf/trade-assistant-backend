import { createConnection } from 'typeorm';
import { Trade } from '../trade/trade.entity';
import { User } from '../user/user.entity';

(async () => {
  const connection = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '15122005',
    database: 'nest_users',
    entities: [Trade, User], // <=== ОБА!
    synchronize: false,
  });

  const tradeRepo = connection.getRepository(Trade);

  const trades = Array.from({ length: 55 }).map((_, i) =>
    tradeRepo.create({
      user: { id: 4 }, // вот так правильно, если есть связь
      date_start: new Date(`2024-04-${(i % 27) + 1}`),
      date_end: new Date(`2024-04-${(i % 27) + 2}`),
      note: `Симуляция трейда #${i + 1}`,
      start_price: 1000 + i * 15,
      end_price: 1020 + i * 10,
    }),
  );

  await tradeRepo.save(trades);
  console.log('✅ Посеяно!');
  await connection.destroy();
})();
