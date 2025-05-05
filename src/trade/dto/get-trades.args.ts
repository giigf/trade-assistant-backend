//src/trade/dto/get-trades.args.ts
import { Field, Float, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min, IsNumber } from 'class-validator';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum TradeSortField {
  ID = 'id',
  DATE_START = 'date_start',
  DATE_END = 'date_end',
  START_PRICE = 'start_price',
  END_PRICE = 'end_price',
}

registerEnumType(SortDirection, { name: 'SortDirection' });
registerEnumType(TradeSortField, { name: 'TradeSortField' });

@InputType()
export class GetTradesArgs {
  // Пагинация
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsInt()
  @Min(1)
  @Max(100) // устанавливаем максимальный лимит
  @IsOptional()
  limit?: number;

  // Сортировка
  @Field(() => TradeSortField, { nullable: true, defaultValue: TradeSortField.DATE_START })
  @IsEnum(TradeSortField)
  @IsOptional()
  sortBy?: TradeSortField;

  @Field(() => SortDirection, { nullable: true, defaultValue: SortDirection.DESC })
  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection;

  // Поиск по примечанию
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  noteSearch?: string;

  // Фильтры по датам
  @Field(() => Date, { nullable: true })
  @IsOptional()
  dateFrom?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  dateTo?: Date;

  // Фильтр по диапазону цен начала
  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  minStartPrice?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  maxStartPrice?: number;

  // Фильтр по диапазону цен окончания
  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  minEndPrice?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  maxEndPrice?: number;

  // Фильтр по результату сделки (прибыль/убыток)
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isProfitable?: boolean;
}
