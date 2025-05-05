import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ResponseToken {
  @Field({ nullable: true })
  accessToken: string;

  @Field({ nullable: true })
  refreshToken: string;
}