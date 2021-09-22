import { Injectable, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { External } from './external.entity';

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

  // KakaoWebtoon: 라지에르의 서
  async getDetailCrawlData() {
    const response = await this.http
      .get('https://gateway-kw.kakao.com/decorator/v1/decorator/contents/2507')
      .toPromise();
    console.log(response.data);
    return response.data;
  }
}
