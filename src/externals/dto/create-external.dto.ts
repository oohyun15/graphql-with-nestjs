import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateExternalDto {
  @Field(() => String)
  identifier: string;
}
