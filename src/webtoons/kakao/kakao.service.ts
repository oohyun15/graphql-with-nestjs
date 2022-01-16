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
    return this.kakaoRepository.findOne({
      where: { identifier: identifier, type: 'Kakao' },
    });
  }

  async findAll(): Promise<Kakao[]> {
    return this.kakaoRepository.find();
  }

  async create(createWebtoonDto: CreateWebtoonDto): Promise<void> {
    createWebtoonDto.type = 'Kakao';
    await this.kakaoRepository.save(createWebtoonDto);
  }

  async update(kakao: Kakao): Promise<void> {
    await this.kakaoRepository.save(kakao);
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
    links.forEach((link) => {
      this.extractIdentifier(link);
    });
  }

  async extractIdentifier(link: string) {
    let count = 0;

    const resp = await this.http.get(link).toPromise();
    let list;
    if (resp.data.data.sections !== undefined) {
      // hash type
      list = resp.data.data.sections.map((s) => s.cardGroups[0].cards).flat();
    } else if (resp.data.data[0] !== undefined) {
      // array type
      list = resp.data.data[0].cardGroups[0].cards;
    }
    // return list;
    const identifiers: string[] = list
      .filter((e) => e.content.ageLimit != 19)
      .map((e) => e.content.id.toString());

    identifiers.forEach((identifier) => {
      let dto = new CreateWebtoonDto();
      dto.type = 'Kakao';
      dto.identifier = identifier;
      this.create(dto);
    });
  }

  async crawl(id: number) {
    // find webtoon
    let webtoon = await this.kakaoRepository.findOne(id);

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
    return this.kakaoRepository.save(webtoon);
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
