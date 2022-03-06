import { Injectable, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateWebtoonDto } from '../dto/create-webtoon.dto';
import { WebtoonsService } from '../webtoons.service';
import { Naver } from './naver.entity';

@Injectable()
export class NaverService extends WebtoonsService {
  constructor(
    @InjectRepository(Naver)
    private readonly naverRepository: Repository<Naver>,
    private readonly http: HttpService,
  ) {
    super(naverRepository);
  }

  async find(id: number): Promise<Naver> {
    return this.naverRepository.findOne(id);
  }

  async findByIdentifier(identifier: string): Promise<Naver> {
    let dto = new CreateWebtoonDto();
    dto.identifier = identifier;
    dto.type = 'Naver';
    return this.naverRepository.findOne(dto);
  }

  async findAll(): Promise<Naver[]> {
    return this.naverRepository.find();
  }

  async create(dto: CreateWebtoonDto): Promise<Naver> {
    let webtoon = new Naver();
    webtoon.type = dto.type;
    webtoon.identifier = dto.identifier;
    webtoon = await this.crawl(webtoon);
    webtoon = await this.naverRepository.save(webtoon);
    return webtoon;
  }

  async findOrCreateByIdentifier(identifier: string): Promise<Naver> {
    const webtoon = await this.findByIdentifier(identifier);
    if (webtoon !== undefined) {
      return webtoon;
    }
    // console.log("NEW ONE!", identifier)
    let dto = new CreateWebtoonDto();
    dto.identifier = identifier;
    dto.type = 'Naver';
    return this.create(dto);
  }

  async update(webtoon: Naver): Promise<void> {
    await this.naverRepository.save(webtoon);
  }

  async delete(id: number): Promise<DeleteResult> {
    const result = await this.naverRepository.delete(id);
    return result;
  }

  async extractAllIdentifier() {
    const links: string[] = [];

    let identifiers = [];
    for await (const link of links) {
      identifiers.push(await this.extractIdentifier(link));
    }
    identifiers = [...new Set(identifiers.flat())];
    console.log('identifier.length:' + identifiers.length);
    identifiers.forEach((identifier) => {
      this.findOrCreateByIdentifier(identifier);
    });
  }

  async extractIdentifier(link: string): Promise<string[]> {
    const resp = await this.http.get(link).toPromise();
    let lists: any;
    if (resp.data.data.sections !== undefined) {
      // hash type
      lists = resp.data.data.sections.map((s) => s.cardGroups[0].cards).flat();
    } else if (resp.data.data[0] !== undefined) {
      // array type
      lists = resp.data.data[0].cardGroups[0].cards;
    }
    const identifiers: string[] = lists
      .filter((e: any) => e.content.ageLimit != 19)
      .map((e: any) => e.content.id.toString());

    return identifiers;
  }

  async crawl(webtoon: Naver) {
    // crawl webtoon data

    return webtoon;
  }
}
