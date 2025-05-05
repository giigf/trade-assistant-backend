import { ObjectType, Field } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

// Generic class factory for creating response types
export function createCommonResponseType<T>(dataType: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class CommonResponseClass {
    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;

    @Field(() => dataType, { nullable: true })
    data?: T;
  }
  return CommonResponseClass;
}

// Base common response without data
@ObjectType()
export class BaseCommonResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}