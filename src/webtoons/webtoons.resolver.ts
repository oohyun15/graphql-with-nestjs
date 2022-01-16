import { NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { Webtoon } from './webtoon.entity';
import { WebtoonsService } from './webtoons.service';

const pubSub = new PubSub();

@Resolver(() => Webtoon)
export class WebtoonsResolver {
  constructor(private readonly webtoonsService: WebtoonsService) {}

  @Query(() => Webtoon)
  async findWebtoon(@Args('id') id: string): Promise<Webtoon> {
    const webtoon = await this.webtoonsService.find(id);
    if (!webtoon) throw new NotFoundException(id);
    return webtoon;
  }
}
