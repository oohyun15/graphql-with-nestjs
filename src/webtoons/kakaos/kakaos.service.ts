import { Injectable, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateWebtoonDto } from '../dto/create-webtoon.dto';
import { Kakao } from './kakao.entity';

@Injectable()
export class KakaosService {
  constructor(
    @InjectRepository(Kakao)
    private readonly kakaosRepository: Repository<Kakao>,
    private readonly http: HttpService,
  ) {}

  async find(id: number): Promise<Kakao> {
    return this.kakaosRepository.findOne(id);
  }

  async findByIdentifier(identifier: string): Promise<Kakao> {
    return this.kakaosRepository.findOne({ identifier: identifier })
  }

  async findAll(): Promise<Kakao[]> {
    return this.kakaosRepository.find();
  }

  async create(createWebtoonDto: CreateWebtoonDto): Promise<void> {
    await this.kakaosRepository.save({
      type: 'Kakao',
      identifier: createWebtoonDto.identifier,
    });
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await this.kakaosRepository.delete(id);
    return result;
  }

  async getDetailCrawlData(id: number) {
    // find external
    let external = await this.kakaosRepository.findOne(id);

    // crawl webtoon data
    const response = await this.http
      .get(
        `https://gateway-kw.kakao.com/decorator/v1/decorator/contents/${external.identifier}`,
      )
      .toPromise();

    // save external
    return response.data;
  }
}
