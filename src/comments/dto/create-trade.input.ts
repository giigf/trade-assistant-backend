// src/trade/dto/create-trade.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field()
  @Length(2, 500)
  text: string;

  @Field(() => Int)
  tradeId: number;
}
