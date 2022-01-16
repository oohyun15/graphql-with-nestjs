import { Injectable, HttpService, NotFoundException } from '@nestjs/common';
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
    return this.kakaosRepository.findOne({
      where: { identifer: identifier, type: 'Kakao' },
    });
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

  async crawl(id: number) {
    // find webtoon
    let webtoon = await this.kakaosRepository.findOne(id);

    // crawl webtoon data
    const resp = await this.http
      .get(
        `https://gateway-kw.kakao.com/decorator/v1/decorator/contents/${webtoon.identifier}`,
      )
      .toPromise();

    webtoon.title = resp.data.data.title;
    webtoon.description = resp.data.data.synopsis;
    webtoon.status = this.sanitizeStatus(resp.data.data.status); // TODO: profile api로 봐야 함
    webtoon.thumbnail = resp.data.data.sharingThumbnailImage + '.jpg';
    // save webtoon
    return this.kakaosRepository.save(webtoon);
  }

  private sanitizeStatus(status: string): number {
    switch (status) {
      case 'EPISODES_PUBLISHING':
        'continue';
        break;
      case 'END_OF_SEASON':
      case 'SEASON_COMPLETED':
        'season_finish';
        break;
      case 'EPISODES_NOT_PUBLISHING':
        'closed';
        break;
      case 'COMPLETED':
      case 'SELLING':
        'finish';
        break;
      case 'STOP_SELLING':
        throw new NotFoundException('No service available.');
      default:
        throw new NotFoundException(`Unknown status: ${status}`);
    }
    return 0; // TODO: set status to enum field
  }
}
