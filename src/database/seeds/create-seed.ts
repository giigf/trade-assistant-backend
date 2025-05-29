import * as fs from 'fs';
import * as path from 'path';

function createSeed(name: string): void {
  const seedName = name.endsWith('Seed') ? name : `${name}Seed`;
  const fileName = seedName.toLowerCase().replace('seed', '.seed.ts');
  const filePath = path.join(__dirname, fileName);

  if (fs.existsSync(filePath)) {
    console.log(`❌ Seed файл ${fileName} уже существует`);
    return;
  }

  const template = `import { DataSource } from 'typeorm';
import { BaseSeed } from './interfaces/seed.interface';

export class ${seedName} extends BaseSeed {
  getName(): string {
    return '${seedName}';
  }

  async run(dataSource: DataSource): Promise<void> {
    console.log('🌱 Выполняем ${seedName}...');
    
    // TODO: Implement your seed logic here
    
    console.log('✅ ${seedName} завершен!');
  }
}
`;

  fs.writeFileSync(filePath, template);
  console.log(`✅ Создан seed файл: ${fileName}`);
  console.log(`📝 Не забудьте добавить ${seedName} в run-seeds.ts`);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('❌ Укажите имя для нового seed файла');
    console.log('Пример: npm run seed:create -- UserData');
    process.exit(1);
  }

  const seedName = args[0];
  createSeed(seedName);
}

if (require.main === module) {
  main();
}