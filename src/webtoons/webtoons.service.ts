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

  async findByIdentifier(type: string, identifier: string): Promise<Webtoon> {
    let dto = new CreateWebtoonDto();
    dto.type = type;
    dto.identifier = identifier;
    return this.webtoonsRepository.findOne(dto);
  }

  async findOrCreateByIdentifier(dto: CreateWebtoonDto): Promise<Webtoon> {
    const webtoon = await this.findByIdentifier(dto.type, dto.identifier);
    if (webtoon !== undefined) return webtoon;
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
}
