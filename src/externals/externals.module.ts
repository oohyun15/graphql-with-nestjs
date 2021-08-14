import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { External } from './external.entity';
import { ExternalsService } from './externals.service';

@Module({
  imports: [TypeOrmModule.forFeature([External]), HttpModule],
  providers: [ExternalsService],
})
export class ExternalsModule {}
