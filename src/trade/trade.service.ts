import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TradeModel } from './trade.model';
import { Repository } from 'typeorm';
import { CreateTradeInput } from './dto/create-trade.input';
import { UpdateTradeInput } from './dto/update-trade.input';
import { User } from 'src/user/user.entity';
import { Trade } from './trade.entity';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(Trade)
    private tradeRepo: Repository<Trade>,
  ) {}

  async findAllForUser(user: User): Promise<TradeModel[]> {
    return await this.tradeRepo.find({
      where: { user: { id: user.id } },
      order: { date_start: 'DESC' }, // по желанию
    });
  }

  createTrade(user: User, data: CreateTradeInput): Promise<TradeModel> {
    const trade = this.tradeRepo.create({ ...data, user });
    return this.tradeRepo.save(trade);
  }

  async findOneTrade(user: User, id: number): Promise<TradeModel> {
    const trade = await this.tradeRepo.findOne({ where: { id } });
    if (!trade) {
      throw new NotFoundException('Trade не найден');
    }
    if (user.id !== trade.userId) {
      throw new ForbiddenException('У вас нет прав для получения этой сделки');
    }
    return trade;
  }
  async updateTrade(user: User, data: UpdateTradeInput): Promise<TradeModel> {
    const trade = await this.tradeRepo.findOne({ where: { id: data.id } });
    if (!trade) throw new NotFoundException('Trade не найден');
    if (user.id !== trade.userId) {
      throw new ForbiddenException('У вас нет прав для изменения этой сделки');
    }
    Object.assign(trade, data);
    return this.tradeRepo.save(trade);
  }

  async deleteTrade(user: User, id: number): Promise<boolean> {
    const trade = await this.tradeRepo.findOne({ where: { id } });
    if (!trade) {
      throw new NotFoundException('Trade не найден');
    }
    if (user.id !== trade.userId) {
      throw new ForbiddenException('У вас нет прав для удаления этой сделки');
    }
    const res = await this.tradeRepo.delete(id);
    return (res.affected ?? 0) > 0;
  }
}
