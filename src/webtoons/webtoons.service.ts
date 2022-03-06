import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateWebtoonDto } from './dto/create-webtoon.dto';
import { Webtoon, WebtoonWeekDay } from './webtoon.entity';

@Injectable()
export class WebtoonsService {
  constructor(
    @InjectRepository(Webtoon)
    private readonly webtoonsRepository: Repository<Webtoon>,
  ) {}

  async find(id: number): Promise<Webtoon> {
    return this.webtoonsRepository.findOne(id);
  }

  async findByIdentifier(type: string, identifier: string): Promise<Webtoon> {
    let dto = new CreateWebtoonDto();
    dto.type = type;
    dto.identifier = identifier;
    return this.webtoonsRepository.findOne(dto);
  }

  async findOrCreateByIdentifier(type: string, identifier: string): Promise<Webtoon> {
    const webtoon = await this.findByIdentifier(type, identifier);
    if (webtoon !== undefined) return webtoon;
    let dto = new CreateWebtoonDto();
    dto.identifier = identifier;
    dto.type = type;
    return this.create(dto);
  }

  async findAll(): Promise<Webtoon[]> {
    return this.webtoonsRepository.find();
  }

  async create(dto: CreateWebtoonDto): Promise<Webtoon> {
    return await this.webtoonsRepository.save(dto);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await this.webtoonsRepository.delete(id);
    return result;
  }

  // TODO: nestjs에서 bitmask 필드 사용할 수 있는지 확인하기
  encodeWeekDay(array: string[]): number {
    let ret: number = 0;
    array.forEach((wd) => {
      ret += WebtoonWeekDay[wd];
    });
    return ret;
  }

  decodeWeekDay(value: number): string[] {
    const ret: string[] = [];
    const nums = Object.values(WebtoonWeekDay);
    nums.forEach((num: number) => {
      if (value & num) {
        ret.push(WebtoonWeekDay[num]);
      }
    });
    return ret;
  }
}
