// register.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(4, 15)
  name: string;

  @Field()
  @Length(6, 30)
  password: string;
}
