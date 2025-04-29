import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { TradeService } from './trade.service';
import { TradeResolver } from './trade.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Trade])], // ✅ ЭТО ОБЯЗАТЕЛЬНО
  providers: [TradeService, TradeResolver],
  exports: [TradeService], // по желанию, если надо в другом модуле
})
export class TradeModule {}
