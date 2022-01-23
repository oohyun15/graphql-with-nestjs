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
import { KakaoService } from './kakao/kakao.service';
import { Webtoon } from './webtoon.entity';
import { WebtoonsService } from './webtoons.service';

const pubSub = new PubSub();

@Resolver(() => Webtoon)
export class WebtoonsResolver {
  constructor(
    private readonly webtoonsService: WebtoonsService,
    private readonly kakaoService: KakaoService,
  ) {}

  @Query(() => Webtoon)
  async findWebtoon(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Webtoon> {
    const webtoon = await this.webtoonsService.find(id);
    if (!webtoon) throw new NotFoundException(id);
    return webtoon;
  }

  @Query(() => [Webtoon])
  async findWebtoons(): Promise<Webtoon[]> {
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
  async createWebtoonByIdentifier(
    @Args() createWebtoonDto: CreateWebtoonDto,
  ): Promise<Webtoon> {
    let webtoon: Webtoon;
    switch (createWebtoonDto.type) {
      case 'Kakao':
        webtoon = await this.kakaoService.findOrCreateByIdentifier(
          createWebtoonDto.identifier,
        );
        break;
      // case 'Naver':
      //   break;
      default:
        throw new NotFoundException(createWebtoonDto);
    }
    pubSub.publish('webtoonCreated', { webtoonCreated: webtoon });
    return webtoon;
  }

  @Mutation(() => Boolean)
  async removeWebtoon(@Args('id', { type: () => Int }) id: number) {
    return (await this.webtoonsService.remove(id)).affected;
  }

  @Subscription(() => Webtoon)
  webtoonCreated() {
    return pubSub.asyncIterator('webtoonCreated');
  }
}
