import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { External } from './external.entity';

@Injectable()
export class ExternalsService {
  constructor(
    @InjectRepository(External)
    private readonly externalsRepository: Repository<External>,
  ) {}

  async findOneById(id: string): Promise<External> {
    return this.externalsRepository.findOne(id);
  }

  async findAll(): Promise<External[]> {
    return this.externalsRepository.find();
  }

  async remove(id: string): Promise<DeleteResult> {
    const result = await this.externalsRepository.delete(id);
    return result
  }

}
