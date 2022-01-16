import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebtoonsService } from './webtoons.service';
import { KakaoService } from './kakao/kakao.service';
import { Webtoon } from './webtoon.entity';
import { Kakao } from './kakao/kakao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Webtoon, Kakao]), HttpModule],
  providers: [WebtoonsService, KakaoService],
})
export class WebtoonsModule {}
