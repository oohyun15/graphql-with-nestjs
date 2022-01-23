import { Injectable, HttpService, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateWebtoonDto } from '../dto/create-webtoon.dto';
import { Kakao } from './kakao.entity';

const generalNewestLink: string =
  'https://gateway-kw.kakao.com/section/v1/sections?placement=channel_new';
const generalWeekdayLink: string =
  'https://gateway-kw.kakao.com/section/v1/pages/general-weekdays';
const generalCompletedLink: string =
  'https://gateway-kw.kakao.com/section/v1/sections?placement=channel_completed';
const novelNewestLink: string =
  'https://gateway-kw.kakao.com/section/v1/sections?placement=novel_new';
const novelWeekdayLink: string =
  'https://gateway-kw.kakao.com/section/v1/pages/novel-weekdays';
const novelCompletedLink: string =
  'https://gateway-kw.kakao.com/section/v1/sections?placement=novel_completed';

@Injectable()
export class KakaoService {
  constructor(
    @InjectRepository(Kakao)
    private readonly kakaoRepository: Repository<Kakao>,
    private readonly http: HttpService,
  ) {}

  async find(id: number): Promise<Kakao> {
    return this.kakaoRepository.findOne(id);
  }

  async findByIdentifier(identifier: string): Promise<Kakao> {
    let dto = new CreateWebtoonDto();
    dto.identifier = identifier;
    dto.type = 'Kakao';
    return this.kakaoRepository.findOne(dto);
  }

  async findAll(): Promise<Kakao[]> {
    return this.kakaoRepository.find();
  }

  async create(dto: CreateWebtoonDto): Promise<Kakao> {
    let webtoon = new Kakao();
    webtoon.type = dto.type;
    webtoon.identifier = dto.identifier;
    webtoon = await this.crawl(webtoon);
    webtoon = await this.kakaoRepository.save(webtoon);
    return webtoon;
  }

  async findOrCreateByIdentifier(identifier: string): Promise<Kakao> {
    const webtoon = await this.findByIdentifier(identifier);
    if (webtoon !== undefined) {
      console.log('EXIST!', identifier);
      return webtoon;
    }
    // console.log("NEW ONE!", identifier)
    let dto = new CreateWebtoonDto();
    dto.identifier = identifier;
    dto.type = 'Kakao';
    return this.create(dto);
  }

  async update(webtoon: Kakao): Promise<void> {
    await this.kakaoRepository.save(webtoon);
  }

  async delete(id: number): Promise<DeleteResult> {
    const result = await this.kakaoRepository.delete(id);
    return result;
  }

  async extractAllIdentifier() {
    const links: string[] = [
      generalNewestLink,
      generalWeekdayLink,
      generalCompletedLink,
      novelNewestLink,
      novelWeekdayLink,
      novelCompletedLink,
    ];

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

  async crawl(webtoon: Kakao) {
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
    return webtoon;
  }

  // private

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
