import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Webtoon } from './webtoon.entity';
import { WebtoonsResolver } from './webtoons.resolver';
import { WebtoonsService } from './webtoons.service';

@Module({
  imports: [TypeOrmModule.forFeature([Webtoon])],
  providers: [WebtoonsResolver, WebtoonsService],
})
export class WebtoonsModule {}
