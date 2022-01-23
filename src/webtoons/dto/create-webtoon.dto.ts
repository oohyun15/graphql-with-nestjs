import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class CreateWebtoonDto {
  @Field(() => String)
  @IsString()
  identifier: string;

  @Field(() => String)
  @IsString()
  type: string;
}
