import { UseGuards } from '@nestjs/common';
import { Query, Args, Int, Resolver, Mutation } from '@nestjs/graphql';
import { TradeService } from './trade.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { TradeModel } from './trade.model';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { CreateTradeInput } from './dto/create-trade.input';
import { UpdateTradeInput } from './dto/update-trade.input';

@Resolver()
export class TradeResolver {
  constructor(private readonly tradeService: TradeService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [TradeModel])
  getAllTrade(@CurrentUser() user: User): Promise<TradeModel[]> {
    return this.tradeService.findAllForUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => TradeModel)
  getTrade(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TradeModel> {
    return this.tradeService.findOneTrade(user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TradeModel)
  createTrade(
    @CurrentUser() user: User,
    @Args('data') data: CreateTradeInput,
  ): Promise<TradeModel> {
    return this.tradeService.createTrade(user, data);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TradeModel)
  updateTrade(
    @CurrentUser() user: User,
    @Args('data') data: UpdateTradeInput,
  ): Promise<TradeModel> {
    return this.tradeService.updateTrade(user, data);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  deleteTrade(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.tradeService.deleteTrade(user, id);
  }
}
