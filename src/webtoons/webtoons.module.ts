import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebtoonsService } from './webtoons.service';
import { KakaosService } from './kakaos/kakaos.service';
import { Webtoon } from './webtoon.entity';
import { Kakao } from './kakaos/kakao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Webtoon, Kakao]), HttpModule],
  providers: [WebtoonsService, KakaosService],
})
export class WebtoonsModule {}
