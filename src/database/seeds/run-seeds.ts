// src/database/seeds/run-seeds.ts (обновленная версия с исправлениями для PostgreSQL)
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../config/typeorm.config';
import { UserSeed } from './user.seed';
import { TradeSeed } from './trade.seed';
import { CommentSeed } from './comment.seed';
import { BaseSeed } from './interfaces/seed.interface';

class SeedRunner {
  private dataSource: DataSource;
  private seeds: BaseSeed[] = [
    new UserSeed(),
    new TradeSeed(),
    new CommentSeed(),
  ];

  constructor() {
    this.dataSource = new DataSource(dataSourceOptions);
  }

  async run(): Promise<void> {
    try {
      console.log('🚀 Запуск seed процесса...');
      console.log('📡 Подключение к базе данных...');
      
      await this.dataSource.initialize();
      console.log('✅ Подключение к базе данных установлено');

      console.log(`📦 Найдено ${this.seeds.length} seed файлов для выполнения`);
      console.log('=' .repeat(50));

      for (let i = 0; i < this.seeds.length; i++) {
        const seed = this.seeds[i];
        const seedNumber = i + 1;
        
        console.log(`\n[${seedNumber}/${this.seeds.length}] 🌱 Выполняем ${seed.getName()}...`);
        console.log('-'.repeat(40));
        
        const startTime = Date.now();
        await seed.run(this.dataSource);
        const endTime = Date.now();
        
        console.log(`✅ ${seed.getName()} завершен за ${endTime - startTime}ms`);
        console.log('-'.repeat(40));
      }

      console.log('\n' + '='.repeat(50));
      console.log('🎉 Все seeds успешно выполнены!');
      
      // Показываем финальную статистику
      await this.showFinalStats();
      
    } catch (error) {
      console.error('❌ Ошибка при выполнении seeds:', error);
      process.exit(1);
    } finally {
      if (this.dataSource.isInitialized) {
        await this.dataSource.destroy();
        console.log('🔌 Соединение с базой данных закрыто');
      }
    }
  }

  async runSpecific(seedNames: string[]): Promise<void> {
    try {
      console.log(`🎯 Запуск конкретных seeds: ${seedNames.join(', ')}`);
      
      await this.dataSource.initialize();
      console.log('✅ Подключение к базе данных установлено');

      const seedsToRun = this.seeds.filter(seed => 
        seedNames.includes(seed.getName())
      );

      if (seedsToRun.length === 0) {
        console.log('❌ Не найдено seeds с указанными именами');
        console.log('📋 Доступные seeds:', this.seeds.map(s => s.getName()).join(', '));
        return;
      }

      for (const seed of seedsToRun) {
        console.log(`\n🌱 Выполняем ${seed.getName()}...`);
        const startTime = Date.now();
        await seed.run(this.dataSource);
        const endTime = Date.now();
        console.log(`✅ ${seed.getName()} завершен за ${endTime - startTime}ms`);
      }

      console.log('\n🎉 Указанные seeds успешно выполнены!');
      await this.showFinalStats();
      
    } catch (error) {
      console.error('❌ Ошибка при выполнении seeds:', error);
      process.exit(1);
    } finally {
      if (this.dataSource.isInitialized) {
        await this.dataSource.destroy();
      }
    }
  }

  async reset(): Promise<void> {
    try {
      console.log('🗑️  Сброс базы данных...');
      
      await this.dataSource.initialize();
      
      // Для PostgreSQL используем TRUNCATE с CASCADE
      console.log('🧹 Очищаем таблицы...');
      
      // Отключаем проверку foreign key constraints
      await this.dataSource.query('SET session_replication_role = replica;');
      
      // Очищаем таблицы в правильном порядке
      try {
        await this.dataSource.query('TRUNCATE TABLE comments CASCADE;');
        console.log('  ✅ Таблица comments очищена');
      } catch (e) {
        console.log('  ⚠️  Таблица comments не найдена или уже пуста');
      }
      
      try {
        await this.dataSource.query('TRUNCATE TABLE trades CASCADE;');
        console.log('  ✅ Таблица trades очищена');
      } catch (e) {
        console.log('  ⚠️  Таблица trades не найдена или уже пуста');
      }
      
      try {
        await this.dataSource.query('TRUNCATE TABLE users CASCADE;');
        console.log('  ✅ Таблица users очищена');
      } catch (e) {
        console.log('  ⚠️  Таблица users не найдена или уже пуста');
      }
      
      // Включаем обратно проверку foreign key constraints
      await this.dataSource.query('SET session_replication_role = DEFAULT;');
      
      console.log('✅ База данных очищена');
      
    } catch (error) {
      console.error('❌ Ошибка при сбросе базы данных:', error);
      console.log('ℹ️  Возможно, таблицы еще не созданы. Это нормально для первого запуска.');
    } finally {
      if (this.dataSource.isInitialized) {
        await this.dataSource.destroy();
      }
    }
  }

  private async showFinalStats(): Promise<void> {
    try {
      console.log('\n📊 Финальная статистика:');
      console.log('=' .repeat(30));
      
      const userCount = await this.dataSource.getRepository('User').count();
      const tradeCount = await this.dataSource.getRepository('Trade').count();
      const commentCount = await this.dataSource.getRepository('Comment').count();
      
      console.log(`👥 Пользователей: ${userCount}`);
      console.log(`💼 Трейдов: ${tradeCount}`);
      console.log(`💬 Комментариев: ${commentCount}`);
      console.log('=' .repeat(30));
      
    } catch (error) {
      console.log('⚠️  Не удалось получить статистику:', error.message);
    }
  }

  listSeeds(): void {
    console.log('📋 Доступные seeds:');
    this.seeds.forEach((seed, index) => {
      console.log(`  ${index + 1}. ${seed.getName()}`);
    });
  }
}

// Главная функция
async function main() {
  const runner = new SeedRunner();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Запускаем все seeds
    await runner.run();
    return;
  }

  const command = args[0];

  switch (command) {
    case '--reset':
      await runner.reset();
      if (args[1] !== '--no-seed') {
        console.log('\n🔄 Запускаем seeds после сброса...');
        await runner.run();
      }
      break;
      
    case '--list':
      runner.listSeeds();
      break;
      
    case '--only':
      if (args.length < 2) {
        console.log('❌ Укажите имена seeds для выполнения');
        console.log('Пример: npm run seed:run -- --only UserSeed TradeSeed');
        runner.listSeeds();
        process.exit(1);
      }
      await runner.runSpecific(args.slice(1));
      break;
      
    case '--help':
      console.log('🔧 Использование:');
      console.log('  npm run seed:run                    - Запустить все seeds');
      console.log('  npm run seed:run -- --reset         - Очистить БД и запустить все seeds');
      console.log('  npm run seed:run -- --reset --no-seed - Только очистить БД');
      console.log('  npm run seed:run -- --only UserSeed - Запустить только указанные seeds');
      console.log('  npm run seed:run -- --list          - Показать все доступные seeds');
      console.log('  npm run seed:run -- --help          - Показать эту справку');
      break;
      
    default:
      console.log('❌ Неизвестная команда:', command);
      console.log('Используйте --help для справки');
      process.exit(1);
  }
}

// Запуск
if (require.main === module) {
  main().catch(console.error);
}

export { SeedRunner };