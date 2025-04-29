// src/trade/dto/update-trade.input.ts
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateTradeInput } from './create-trade.input';

@InputType()
export class UpdateTradeInput extends PartialType(CreateTradeInput) {
  @Field(() => Int)
  id: number;
}
