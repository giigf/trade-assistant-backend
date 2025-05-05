import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TradeModel } from './trade.model';
import { Repository } from 'typeorm';
import { CreateTradeInput } from './dto/create-trade.input';
import { UpdateTradeInput } from './dto/update-trade.input';
import { User } from 'src/user/user.entity';
import { Trade } from './trade.entity';
import { GetTradesArgs, SortDirection } from './dto/get-trades.args';
import { PaginatedTrades } from './trade.types';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(Trade)
    private tradeRepo: Repository<Trade>,
  ) {}

  async findAllForUser(user: User, args: GetTradesArgs): Promise<PaginatedTrades> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'date_start',
      sortDirection = SortDirection.DESC,
      noteSearch,
      dateFrom,
      dateTo,
      minStartPrice,
      maxStartPrice,
      minEndPrice,
      maxEndPrice,
      isProfitable,
    } = args;

    const allowedSortFields = {
      id: 'trade.id',
      date_start: 'trade.date_start',
      date_end: 'trade.date_end',
      start_price: 'trade.start_price',
      end_price: 'trade.end_price',
    };

    const sortField = allowedSortFields[sortBy];

    if (!sortField) {
      throw new BadRequestException('Недопустимое поле сортировки');
    }

    const queryBuilder = this.tradeRepo
      .createQueryBuilder('trade')
      .where('trade.userId = :userId', { userId: user.id });

    // Добавляем поиск по примечанию
    if (noteSearch) {
      queryBuilder.andWhere('trade.note LIKE :note', {
        note: `%${noteSearch}%`,
      });
    }
    // Фильтрация по датам
    if (dateFrom) {
      queryBuilder.andWhere('trade.date_start >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('trade.date_end <= :dateTo', { dateTo });
    }

    // Фильтрация по диапазону цен начала
    if (minStartPrice !== undefined) {
      queryBuilder.andWhere('trade.start_price >= :minStartPrice', { minStartPrice });
    }

    if (maxStartPrice !== undefined) {
      queryBuilder.andWhere('trade.start_price <= :maxStartPrice', { maxStartPrice });
    }

    // Фильтрация по диапазону цен окончания
    if (minEndPrice !== undefined) {
      queryBuilder.andWhere('trade.end_price >= :minEndPrice', { minEndPrice });
    }

    if (maxEndPrice !== undefined) {
      queryBuilder.andWhere('trade.end_price <= :maxEndPrice', { maxEndPrice });
    }

    // Фильтрация по прибыльности сделки
    if (isProfitable !== undefined) {
      if (isProfitable) {
        queryBuilder.andWhere('trade.end_price > trade.start_price');
      } else {
        queryBuilder.andWhere('trade.end_price <= trade.start_price');
      }
    }

    // Применяем сортировку
    queryBuilder.orderBy(sortField, sortDirection);
    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return {
      items,
      total,
      page,
      limit,
    };
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
    return plainToInstance(TradeModel, trade, {
      excludeExtraneousValues: true,
    });
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
