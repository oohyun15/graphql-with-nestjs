import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CreateUserDto {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;
}
