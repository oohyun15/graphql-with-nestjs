import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateWebtoonDto {
  @Field(() => String)
  identifier: string;

  @Field(() => String)
  type: string;
}
