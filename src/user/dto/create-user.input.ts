// src/user/dto/create-user.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(2, 50)
  name: string;
}
