import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from "@nestjs/graphql";
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    RecipesModule,
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
    }),
  ],
})
export class AppModule { }
