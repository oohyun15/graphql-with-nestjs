import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { WebtoonsModule } from './webtoons/webtoons.module';
import { ExternalsModule } from './externals/externals.module';
import { User } from './users/user.entity';
import { External } from './externals/external.entity';
import { Webtoon } from './webtoons/webtoon.entity';

@Module({
  imports: [
    UsersModule,
    WebtoonsModule,
    ExternalsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'graphql-with-nestjs',
      entities: [User, External, Webtoon],
      synchronize: false,
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      debug: false,
      playground: false,
    }),
  ],
})
export class AppModule {}
