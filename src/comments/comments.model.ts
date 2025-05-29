// trade.model.ts (GraphQL безопасная модель)
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class CommentModel {
  @Field(() => Int)
  @Expose()
  id: number;

  @Expose()
  user: { id: number };

  @Expose()
  trade: { id: number };

  @Field(() => Int)
  @Expose()
  get userId(): number {
    return this.user?.id;
  }

  @Field(() => Int)
  @Expose()
  get tradeId(): number {
    return this.trade?.id;
  }

  @Field()
  @Expose()
  date: Date;

  @Field()
  @Expose()
  text: string;
}
