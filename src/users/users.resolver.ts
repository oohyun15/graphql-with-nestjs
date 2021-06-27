import { NotFoundException } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

const pubSub = new PubSub();

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Query(returns => User)
  async user(@Args('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException(id);
    return user;
  }

  @Query(returns => [User])
  users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Mutation(returns => User)
  async addUser(@Args('createUserDto') createUserDto :CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    pubSub.publish('userAddedd', { userAdded: user });
    return user;
  }

  @Mutation(returns => Boolean)
  async removeUser(@Args('id') id: string) {
    return (await this.usersService.remove(id)).affected;
  }

  @Subscription(returnns => User)
  userAdded() {
    return pubSub.asyncIterator('userAdded');
  }
}
