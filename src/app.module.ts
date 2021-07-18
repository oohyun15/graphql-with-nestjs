import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from "@nestjs/graphql";
import { RecipesModule } from './recipes/recipes.module';
import { UsersModule } from './users/users.module';
import { WebtoonsModule } from './webtoons/webtoons.module';
import { ExternalsModule } from './externals/externals.module';

@Module({
  imports: [
    UsersModule,
    RecipesModule,
    WebtoonsModule,
    ExternalsModule,
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      debug: false,
      playground: false
    }),
  ],
})
export class AppModule { }
