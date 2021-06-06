import { Module } from '@nestjs/common';
import { DateScaler } from 'src/common/scalars/date.scalar';
import { RecipesResolver } from './recipes.resolver';
import { RecipesService } from './recipes.service';

@Module({
  providers: [RecipesResolver, RecipesService, DateScaler],
})
export class RecipesModule {}
