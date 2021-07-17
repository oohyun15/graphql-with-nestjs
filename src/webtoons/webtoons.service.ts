import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Webtoon } from './webtoon.entity';

@Injectable()
export class WebtoonsService {
  constructor(
    @InjectRepository(Webtoon)
    private readonly webtoonsRepository: Repository<Webtoon>,
  ){}

  async findOneById(id: string): Promise<Webtoon> {
    return this.webtoonsRepository.findOne(id);
  }

  async findAll(): Promise<Webtoon[]> {
    return this.webtoonsRepository.find();
  }

  async remove(id: string): Promise<DeleteResult> {
    const result = await this.webtoonsRepository.delete(id);
    return result
  }
}
