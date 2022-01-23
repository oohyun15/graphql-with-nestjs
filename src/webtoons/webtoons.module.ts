import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebtoonsService } from './webtoons.service';
import { KakaoService } from './kakao/kakao.service';
import { Webtoon } from './webtoon.entity';
import { Kakao } from './kakao/kakao.entity';
import { WebtoonsResolver } from './webtoons.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Webtoon, Kakao]), HttpModule],
  providers: [WebtoonsService, KakaoService, WebtoonsResolver],
})
export class WebtoonsModule {}
