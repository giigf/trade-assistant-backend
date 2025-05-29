import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Trade } from 'src/trade/trade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Trade)
    private tradeRepo: Repository<Trade>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { id } = ctx.getArgs(); // достаём id из аргументов запроса

    const request = ctx.getContext();
    const user = request.req.user;

    const trade = await this.tradeRepo.findOne({ where: { id } });
    if (!trade || trade.userId !== user.id) {
      throw new ForbiddenException('Нет доступа к трейду');
    }
    return true;
  }
}
