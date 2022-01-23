import { NotFoundException } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { CreateWebtoonDto } from './dto/create-webtoon.dto';
import { Webtoon } from './webtoon.entity';
import { WebtoonsService } from './webtoons.service';

const pubSub = new PubSub();

@Resolver(() => Webtoon)
export class WebtoonsResolver {
  constructor(private readonly webtoonsService: WebtoonsService) {}

  @Query(() => Webtoon)
  async findWebtoon(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Webtoon> {
    const webtoon = await this.webtoonsService.find(id);
    if (!webtoon) throw new NotFoundException(id);
    return webtoon;
  }

  @Query(() => [Webtoon])
  findWebtoons(): Promise<Webtoon[]> {
    return this.webtoonsService.findAll();
  }

  @Query(() => Webtoon)
  async findWebtoonByIdentifier(
    @Args('type') type: string,
    @Args('identifier') identifier: string,
  ): Promise<Webtoon> {
    const webtoon = await this.webtoonsService.findByIdentifier(
      type,
      identifier,
    );
    if (!webtoon) throw new NotFoundException({ type, identifier });
    return webtoon;
  }

  @Mutation(() => Webtoon)
  async addWebtoon(
    @Args('createWebtoonDto') createWebtoonDto: CreateWebtoonDto,
  ) {
    const webtoon = await this.webtoonsService.create(createWebtoonDto);
    pubSub.publish('webtoonAdded', { webtoonAdded: webtoon });
    return webtoon;
  }

  @Mutation(() => Boolean)
  async removeWebtoon(@Args('id') id: number) {
    return (await this.webtoonsService.remove(id)).affected;
  }

  @Subscription(() => Webtoon)
  webtoonAdded() {
    return pubSub.asyncIterator('webtoonAdded');
  }
}
