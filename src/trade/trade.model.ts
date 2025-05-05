// trade.model.ts (GraphQL безопасная модель)
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class TradeModel {
  @Field(() => Int)
  @Expose()
  id: number;

  @Field(() => Int)
  @Expose()
  userId: number;

  @Field()
  @Expose()
  date_start: Date;

  @Field()
  @Expose()
  date_end: Date;

  @Field({ nullable: true })
  note?: string;

  @Field(() => Float)
  @Expose()
  start_price: number;

  @Field(() => Float)
  @Expose()
  end_price: number;
}
