// trade.model.ts (GraphQL безопасная модель)
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class TradeModel {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field()
  date_start: Date;

  @Field()
  date_end: Date;

  @Field({ nullable: true })
  note?: string;

  @Field(() => Float)
  start_price: number;

  @Field(() => Float)
  end_price: number;
}
