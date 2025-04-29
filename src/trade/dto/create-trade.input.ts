// src/trade/dto/create-trade.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsDate, IsNumber, IsPositive, Length } from 'class-validator';

@InputType()
export class CreateTradeInput {
  @Field()
  @IsDate()
  date_start: Date;

  @Field()
  @IsDate()
  date_end: Date;

  @Field({ nullable: true })
  @Length(2, 500)
  note?: string;

  @Field()
  @IsPositive()
  @IsNumber()
  start_price: number;

  @Field()
  @IsNumber()
  end_price: number;
}
