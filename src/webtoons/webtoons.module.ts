import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebtoonsService } from './webtoons.service';
import { KakaoService } from './kakao/kakao.service';
import { Webtoon } from './webtoon.entity';
import { Kakao } from './kakao/kakao.entity';
import { WebtoonsResolver } from './webtoons.resolver';
import { NaverService } from './naver/naver.service';
import { Naver } from './naver/naver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Webtoon, Kakao, Naver]), HttpModule],
  providers: [WebtoonsService, KakaoService, NaverService, WebtoonsResolver],
})
export class WebtoonsModule {}
