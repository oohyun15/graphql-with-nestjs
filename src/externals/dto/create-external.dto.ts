import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateExternalDto {
  @Field(() => String)
  type: string;

  @Field(() => String)
  identifier: string;
}
