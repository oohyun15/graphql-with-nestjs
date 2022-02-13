import { Injectable, HttpService, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateWebtoonDto } from '../dto/create-webtoon.dto';
import { WebtoonStatus, WebtoonWeekDay } from '../webtoon.entity';
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
    const detail = await this.crawlDetail(webtoon.identifier);
    const profile = await this.crawlProfile(webtoon.identifier);
    const episode = await this.crawlEpisode(webtoon.identifier);

    webtoon.title = detail['title'];
    webtoon.description = detail['description'];
    webtoon.thumbnail = detail['thumbnail'] || detail['cover'];
    webtoon.status = profile['status'];
    webtoon.weekDay = this.encodeWeekDay(profile['weekDay']);
    webtoon.startDate = episode['startDate'];
    webtoon.endDate = episode['endDate'];
    webtoon.gradeAge = episode['gradeAge'];
    return webtoon;
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

  // private

  private apiDetailLink(identifier: string): string {
    return `https://gateway-kw.kakao.com/decorator/v1/decorator/contents/${identifier}`;
  }

  private apiProfileLink(identifier: string): string {
    return `https://gateway-kw.kakao.com/decorator/v1/decorator/contents/${identifier}/profile`;
  }

  private apiEpisodeLink(
    identifier: string,
    offset: number = 0,
    limit: number = 30,
  ): string {
    return `https://gateway-kw.kakao.com/episode/v1/views/content-home/contents/${identifier}/episodes?sort=-NO&offset=${offset}&limit=${limit}`;
  }

  private async crawlDetail(identifier: string): Promise<object> {
    const ret: object = {};
    const resp = await this.http
      .get(this.apiDetailLink(identifier))
      .toPromise();

    ret['title'] = resp.data.data.title;
    ret['seoId'] = resp.data.data.seoId;
    ret['genre'] = [resp.data.data.genre];
    ret['description'] = resp.data.data.synopsis;
    ret['thumbnail'] = resp.data.data.sharingThumbnailImage + '.jpg';
    ret['cover'] = resp.data.data.backgroundImage + '.jpg';
    return ret;
  }

  private async crawlProfile(identifier: string): Promise<object> {
    const ret: object = {};
    const resp = await this.http
      .get(this.apiProfileLink(identifier))
      .toPromise();

    const badges = resp.data.data.badges;
    const status = badges.filter((badge) => badge.type === 'STATUS')[0];
    ret['status'] = this.sanitizeStatus(status.title);
    ret['weekDay'] = badges
      .filter((badge) => badge.type === 'WEEKDAYS')
      .map((weekday) => weekday.title);
    ret['keyword'] = resp.data.data.seoKeywords;
    return ret;
  }

  private async crawlEpisode(identifier: string) {
    const ret: object = {};
    const resp = await this.http
      .get(this.apiEpisodeLink(identifier, 0, 999), {
        headers: { 'accept-language': 'ko' },
      })
      .toPromise();

    const episodes = resp.data.data.episodes;
    ret['startDate'] = resp.data.data.first.serialStartDateTime;
    ret['endDate'] = resp.data.data.episodes[0].serialStartDateTime;
    ret['gradeAge'] = resp.data.data.first.ageLimit;
    return ret;
  }

  private sanitizeStatus(status: string): number {
    switch (status) {
      case 'EPISODES_PUBLISHING':
        return WebtoonStatus.CONTUNUE;
      case 'END_OF_SEASON':
      case 'SEASON_COMPLETED':
        return WebtoonStatus.SEASON_FINISH;
      case 'EPISODES_NOT_PUBLISHING':
        return WebtoonStatus.CLOSED;
      case 'COMPLETED':
        return WebtoonStatus.FINISH;
      case 'STOP_SELLING':
        throw new NotFoundException('No service available.');
      default:
        throw new NotFoundException(`Unknown status: ${status}`);
    }
  }
}
