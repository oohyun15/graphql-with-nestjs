import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateWebtoonDto } from './dto/create-webtoon.dto';
import { Webtoon } from './webtoon.entity';

@Injectable()
export class WebtoonsService {
  constructor(
    @InjectRepository(Webtoon)
    private readonly webtoonsRepository: Repository<Webtoon>,
  ) {}

  async find(id: number): Promise<Webtoon> {
    return this.webtoonsRepository.findOne(id);
  }

  async findAll(): Promise<Webtoon[]> {
    return this.webtoonsRepository.find();
  }

  async create(createWebtoonDto: CreateWebtoonDto): Promise<Webtoon> {
    return await this.webtoonsRepository.save(createWebtoonDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await this.webtoonsRepository.delete(id);
    return result;
  }
}
