import { UseGuards } from '@nestjs/common';
import { Query, Args, Int, Resolver, Mutation } from '@nestjs/graphql';
import { TradeService } from './trade.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { TradeModel } from './trade.model';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { CreateTradeInput } from './dto/create-trade.input';
import { UpdateTradeInput } from './dto/update-trade.input';
import { GetTradesArgs } from './dto/get-trades.args';
import { PaginatedTrades, TradeResponse, PaginatedTradesResponse, BooleanResponse } from './trade.types';

@Resolver()
export class TradeResolver {
  constructor(private readonly tradeService: TradeService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedTradesResponse)
  async getAllTrade(
    @CurrentUser() user: User,
    @Args('filter') filter: GetTradesArgs,
  ): Promise<PaginatedTradesResponse> {
    const trades = await this.tradeService.findAllForUser(user, filter);
    return {
      success: true,
      message: 'Trade успешно вернули',
      data: trades,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => TradeResponse)
  async getTrade(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TradeResponse> {
    const trade = await this.tradeService.findOneTrade(user, id);
    return {
      success: true,
      message: 'Trade успешно вернули',
      data: trade,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TradeResponse)
  async createTrade(
    @CurrentUser() user: User,
    @Args('data') data: CreateTradeInput,
  ): Promise<TradeResponse> {
    const trade = await this.tradeService.createTrade(user, data);
    return {
      success: true,
      message: 'Trade успешно создан',
      data: trade,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TradeResponse)
  async updateTrade(
    @CurrentUser() user: User,
    @Args('data') data: UpdateTradeInput,
  ): Promise<TradeResponse> {
    const trade = await this.tradeService.updateTrade(user, data);
    return {
      success: true,
      message: 'Trade успешно обновлен',
      data: trade,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => BooleanResponse)
  async deleteTrade(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<BooleanResponse> {
    const result = await this.tradeService.deleteTrade(user, id);
    return {
      success: result,
      message: result ? 'Удаление успешно' : 'Удаление не удалось',
      data: result,
    };
  }
}
