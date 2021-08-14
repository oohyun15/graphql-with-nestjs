import { Injectable, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { External } from './external.entity';
import { map } from 'rxjs/operators';

@Injectable()
export class ExternalsService {
  constructor(
    @InjectRepository(External)
    private readonly externalsRepository: Repository<External>,
    private readonly http: HttpService,
  ) {}

  async findOneById(id: string): Promise<External> {
    return this.externalsRepository.findOne(id);
  }

  async findAll(): Promise<External[]> {
    return this.externalsRepository.find();
  }

  async remove(id: string): Promise<DeleteResult> {
    const result = await this.externalsRepository.delete(id);
    return result;
  }

  // async getCrawlData() {
  // }

  // KakaoWebtoon: 라지에르의 서
  async getDetailCrawlData() {
    return this.http.get('https://gateway-kw.kakao.com/decorator/v1/decorator/contents/2507')
      .pipe(map((response) => response.data));
  }
}
