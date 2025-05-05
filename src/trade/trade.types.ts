import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TradeModel } from './trade.model';
import { createCommonResponseType } from './response.type';

@ObjectType()
export class PaginatedTrades {
  @Field(() => [TradeModel])
  items: TradeModel[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}

// Create specific response types for each return type
@ObjectType('TradeResponse')
export class TradeResponse extends createCommonResponseType(TradeModel) {}

@ObjectType('PaginatedTradesResponse')
export class PaginatedTradesResponse extends createCommonResponseType( PaginatedTrades ) {}

@ObjectType('BooleanResponse')
export class BooleanResponse extends createCommonResponseType(Boolean) {}
