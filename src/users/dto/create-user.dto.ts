import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;
}
